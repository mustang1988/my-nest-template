import { Logger } from 'winston';
import { existsSync } from 'node:fs';
import { isURL } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Media } from '../implement/media.impl';
import { plainToInstance } from 'class-transformer';
import { IMedia } from '../interface/media.interface';
import { MediaException } from '../exception/media.exception';
import { ContextService } from 'src/context/service/context.service';
import { InjectLogger } from 'src/logger/decorator/inject-logger.decorator';

const execFileAsync = promisify(execFile);

/**
 * ffprobe单次执行的超时时长(毫秒)
 *
 * 超时后子进程被终止并抛出异常, 避免不可达的URL输入等场景长时间占用请求
 */
const FFPROBE_TIMEOUT_MS = 30_000;

/**
 * ffprobe执行输出缓冲区上限(字节)
 */
const FFPROBE_MAX_BUFFER = 10 * 1024 * 1024;

/**
 * 媒体探测结果缓存容量上限(条)
 *
 * 同一输入的重复探测直接复用缓存结果(如同一DTO属性挂多个媒体校验器时), 避免重复执行ffprobe;
 * URL输入时尤为昂贵, 每次探测都会重新下载媒体文件
 */
const MEDIA_CACHE_MAX_SIZE = 100;

/**
 * 媒体服务
 */
@Injectable()
export class MediaService {
  /**
   * 媒体探测结果缓存(LRU)
   *
   * Key为输入(文件路径或URL), Value为探测中的Promise; 并发的相同输入合并为同一次探测
   */
  private readonly mediaCache: Map<string, Promise<IMedia>> = new Map();

  constructor(
    private readonly ctx: ContextService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
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
  async readMedia(filepathOrUrl: string): Promise<IMedia> {
    if (isURL(filepathOrUrl)) {
      return this.readMediaByUrl(filepathOrUrl);
    }
    return this.readMediaByFilepath(filepathOrUrl);
  }

  /**
   * 读取指定路径下的媒体文件信息
   * @param filepath 文件路径
   * @return 媒体信息
   * @throws MediaException
   */
  async readMediaByFilepath(filepath: string): Promise<IMedia> {
    const requestId = this.ctx.getRequestId();
    if (!existsSync(filepath)) {
      this.logger.error('[%s] 读取媒体文件信息, 未找到指定文件: filepath = %s', requestId, filepath);
      throw new MediaException('未找到指定文件', { cause: { filepath } });
    }
    return this.probeMedia(filepath);
  }

  /**
   * 读取指定url的媒体信息
   * @param url 文件url
   * @return 媒体信息
   * @throws MediaException
   */
  async readMediaByUrl(url: string): Promise<IMedia> {
    const requestId = this.ctx.getRequestId();
    if (!isURL(url)) {
      this.logger.error('[%s] 读取媒体URL信息, 指定URL格式无效: url = %s', requestId, url);
      throw new MediaException('指定URL格式无效', { cause: { url } });
    }
    return this.probeMedia(url);
  }

  /**
   * 执行ffprobe探测媒体信息(带缓存)
   *
   * @param input 输入(文件路径或URL)
   * @return 媒体信息
   */
  private probeMedia(input: string): Promise<IMedia> {
    const cached = this.mediaCache.get(input);
    if (cached) {
      /**
       * 删除后重新插入, 刷新该输入在缓存中的LRU访问顺序
       */
      this.mediaCache.delete(input);
      this.mediaCache.set(input, cached);
      return cached;
    }
    if (this.mediaCache.size >= MEDIA_CACHE_MAX_SIZE) {
      /**
       * 容量达上限时淘汰最旧条目(Map迭代顺序为插入顺序, 首个键即最旧且最久未访问的输入)
       */
      const oldestInput = this.mediaCache.keys().next().value;
      if (oldestInput !== undefined) {
        this.mediaCache.delete(oldestInput);
      }
    }
    /**
     * 探测中的Promise先行存入缓存(并发相同输入合并为一次探测); 探测失败的输入不保留缓存, 后续调用可重试
     */
    const probing = this.executeFfprobe(input).catch((error: unknown) => {
      this.mediaCache.delete(input);
      throw error;
    });
    this.mediaCache.set(input, probing);
    return probing;
  }

  /**
   * 执行ffprobe并转换结果为媒体实例
   *
   * @param input 输入(文件路径或URL)
   * @return 媒体信息
   * @throws MediaException
   */
  private async executeFfprobe(input: string): Promise<IMedia> {
    const requestId = this.ctx.getRequestId();
    /**
     * 以参数数组方式调用ffprobe, 不经shell解释: 输入中的shell元字符仅被作为普通文件路径/URL字符处理, 避免命令注入;
     * 同时也天然支持包含空格/引号等特殊字符的文件路径, 无需对路径做拆分处理
     */
    const ffprobeArgs = ['-v', '0', '-of', 'json', '-show_format', '-show_streams', '-i', input];
    this.logger.debug('[%s] 读取媒体信息: ffprobeArgs = %j', requestId, ffprobeArgs);
    try {
      const { stdout } = await execFileAsync('ffprobe', ffprobeArgs, {
        timeout: FFPROBE_TIMEOUT_MS,
        maxBuffer: FFPROBE_MAX_BUFFER,
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
