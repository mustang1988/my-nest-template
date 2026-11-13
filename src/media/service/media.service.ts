import { Logger } from 'winston';
import { existsSync } from 'node:fs';
import { isURL } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { execSync } from 'node:child_process';
import { basename, dirname } from 'node:path';
import { Media } from '../implement/media.impl';
import { plainToInstance } from 'class-transformer';
import { IMedia } from '../interface/media.interface';
import { MediaException } from '../exception/media.exception';
import { ContextService } from 'src/context/service/context.service';
import { InjectLogger } from 'src/logger/decorator/inject-logger.decorator';

/**
 * 媒体服务
 */
@Injectable()
export class MediaService {
  private readonly readMediaCommand = `ffprobe -v 0 -of json -show_format -show_streams -i ":input"`;

  constructor(
    private readonly ctx: ContextService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  readMedia(filepathOrUrl: string): IMedia {
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
  readMediaByFilepath(filepath: string): IMedia {
    const requestId = this.ctx.getRequestId();
    if (!existsSync(filepath)) {
      this.logger.error('[%s] 读取媒体文件信息, 未找到指定文件: filepath = %s', requestId, filepath);
      throw new MediaException('未找到指定文件', { cause: { filepath } });
    }

    const command = this.readMediaCommand.replace(':input', basename(filepath));
    const cwd = dirname(filepath);
    this.logger.debug('[%s] 读取媒体文件信息: command = %s, cwd = %s', requestId, command, cwd);
    try {
      const stdout = execSync(command, { cwd });
      const media = plainToInstance(Media, JSON.parse(stdout.toString()));
      this.logger.debug('[%s] 读取媒体文件信息: media = %j', requestId, media);
      return media;
    } catch (error) {
      this.logger.error('[%s] 读取媒体文件信息, 异常: error = %o', requestId, error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }

  /**
   * 读取指定url的媒体信息
   * @param url 文件url
   * @return 媒体信息
   * @throws MediaException
   */
  readMediaByUrl(url: string): IMedia {
    const requestId = this.ctx.getRequestId();
    if (!isURL(url)) {
      this.logger.error('[%s] 读取媒体URL信息, 指定URL格式无效: url = %s', requestId, url);
      throw new MediaException('指定URL格式无效', { cause: { url } });
    }

    const command = this.readMediaCommand.replace(':input', url);
    this.logger.debug('[%s] 读取媒体URL信息: command = %s', requestId, command);

    try {
      const stdout = execSync(command);
      const media = plainToInstance(Media, JSON.parse(stdout.toString()));
      this.logger.debug('[%s] 读取媒体URL信息: media = %j', requestId, media);
      return media;
    } catch (error) {
      this.logger.error('[%s] 读取媒体URL信息, 异常: error = %o', requestId, error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }
}
