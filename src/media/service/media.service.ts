import ms from 'ms';
import bytes from 'bytes';
import QuickLRU from 'quick-lru';
import { Logger } from 'winston';
import { promisify } from 'util';
import { existsSync } from 'node:fs';
import { isURL } from 'class-validator';
import { execFile } from 'child_process';
import { ConfigService } from '@nestjs/config';
import { Media } from '../implement/media.impl';
import { plainToInstance } from 'class-transformer';
import { IMedia } from '../interface/media.interface';
import { MEDIA_CACHE_TOKEN } from '../media.constant';
import { MediaException } from '../exception/media.exception';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ContextService } from 'src/context/service/context.service';
import { InjectLogger } from 'src/logger/decorator/inject-logger.decorator';
import type { MediaReadOptions } from '../interface/media-read-options.interface';
import { LoggingPerformance } from 'src/logger/decorator/logging-performance.decorator';
import { IMediaConfiguration } from 'src/configuration/interface/media-configuration.interface';

/**
 * 媒体服务
 */
@Injectable()
export class MediaService implements OnModuleInit {
  /**
   * 媒体模块配置
   */
  private readonly mediaConfig: IMediaConfiguration;

  /**
   * execFile()函数Promise包装
   */
  private readonly execFileAsync = promisify(execFile);

  constructor(
    private readonly ctx: ContextService,
    private readonly configService: ConfigService,
    @InjectLogger() private readonly logger: Logger,
    @Inject(MEDIA_CACHE_TOKEN) private readonly mediaCache: QuickLRU<string, Promise<IMedia>>,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    this.mediaConfig = this.configService.getOrThrow<IMediaConfiguration>('media');
  }

  async onModuleInit() {
    // 检测当前运行环境中是否已正确安装有ffprobe
    const ffprobeArgs = ['-version'];
    try {
      /**
       * 命令: ffprobe -version
       */
      const { stdout } = await this.execFileAsync('ffprobe', ffprobeArgs, {
        timeout: this.mediaConfig.timeout,
        maxBuffer: this.mediaConfig.maxBuffer,
        windowsHide: true,
      });
      this.logger.debug('ffprobe安装信息:\n%s', stdout);
    } catch (error) {
      this.logger.error('ffprobe未正确安装: error = %o', error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }

  /**
   * 读取媒体文件信息
   *
   * 注意: 输入来源不受信任时(如来自用户提交的DTO属性), 存在读取服务器本地任意文件与向任意地址发起请求(SSRF)的风险,
   * 调用方应自行限定允许的输入范围(如仅允许应用管理的存储路径或受信域名)
   *
   * @param filepathOrUrl 文件路径或URL
   * @return 媒体信息
   * @throws MediaException
   */
  @LoggingPerformance()
  async readMedia(filepathOrUrl: string, options?: MediaReadOptions): Promise<IMedia> {
    if (isURL(filepathOrUrl)) {
      return this.readMediaByUrl(filepathOrUrl, options);
    }
    return this.readMediaByFilepath(filepathOrUrl, options);
  }

  /**
   * 读取指定路径下的媒体文件信息
   * @param filepath 文件路径
   * @return 媒体信息
   * @throws MediaException
   */
  async readMediaByFilepath(filepath: string, options?: MediaReadOptions): Promise<IMedia> {
    const requestId = this.ctx.getRequestId();
    if (!existsSync(filepath)) {
      this.logger.error('[%s] 读取媒体文件信息, 未找到指定文件: filepath = %s', requestId, filepath);
      throw new MediaException('未找到指定文件', { cause: { filepath } });
    }
    return this.probeMedia(filepath, options);
  }

  /**
   * 读取指定url的媒体信息
   * @param url 文件url
   * @return 媒体信息
   * @throws MediaException
   */
  async readMediaByUrl(url: string, options?: MediaReadOptions): Promise<IMedia> {
    const requestId = this.ctx.getRequestId();
    if (!isURL(url)) {
      this.logger.error('[%s] 读取媒体URL信息, 指定URL格式无效: url = %s', requestId, url);
      throw new MediaException('指定URL格式无效', { cause: { url } });
    }
    return this.probeMedia(url, options);
  }

  /**
   * 执行ffprobe探测媒体信息(带缓存)
   *
   * @param input 输入(文件路径或URL)
   * @return 媒体信息
   */
  private probeMedia(input: string, options?: MediaReadOptions): Promise<IMedia> {
    const cacheKey = JSON.stringify({ input, options }); // 仅使用input作为缓存key时, 当连续访问同一媒体的信息但可选选项不同时, 会返回预期外的缓存结果
    const cached = this.mediaCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    /**
     * 探测中的Promise先行存入缓存(并发相同输入合并为一次探测); 探测失败的输入不保留缓存, 后续调用可重试
     */
    const probing = this.executeFfprobe(input, options).catch((error: unknown) => {
      this.mediaCache.delete(cacheKey);
      throw error;
    });
    this.mediaCache.set(cacheKey, probing);
    return probing;
  }

  /**
   * 执行ffprobe并转换结果为媒体实例
   *
   * @param input 输入(文件路径或URL)
   * @return 媒体信息
   * @throws MediaException
   */
  private async executeFfprobe(input: string, options?: MediaReadOptions): Promise<IMedia> {
    const requestId = this.ctx.getRequestId();
    const readStreams = options?.readStreams ?? true;
    const readFormat = options?.readFormat ?? true;
    /**
     * 以参数数组方式调用ffprobe, 不经shell解释: 输入中的shell元字符仅被作为普通文件路径/URL字符处理, 避免命令注入;
     * 同时也天然支持包含空格/引号等特殊字符的文件路径, 无需对路径做拆分处理
     */
    const ffprobeArgs = ['-v', '0', '-of', 'json'];
    if (readStreams) {
      ffprobeArgs.push('-show_streams');
    }
    if (readFormat) {
      ffprobeArgs.push('-show_format');
    }
    ffprobeArgs.push('-i', input);
    this.logger.debug('[%s] 读取媒体信息: ffprobeArgs = %j', requestId, ffprobeArgs);
    try {
      /**
       * 命令: ffprobe -v 0 -of json [-show_streams] [-show_format] -i <input>
       */
      const { stdout } = await this.execFileAsync('ffprobe', ffprobeArgs, {
        timeout: this.mediaConfig.timeout,
        maxBuffer: this.mediaConfig.maxBuffer,
        windowsHide: true,
      });
      const media = plainToInstance(Media, JSON.parse(stdout.toString()));
      this.logger.debug('[%s] 读取媒体信息: media = %j', requestId, media);
      return media;
    } catch (error) {
      this.logger.error('[%s] 读取媒体信息, 异常: input = %s, error = %o', requestId, input, error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }
}
