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

  readMediaByFilepath(filepath: string): IMedia {
    const requestId = this.ctx.getRequestId();
    if (!existsSync(filepath)) {
      this.logger.error('[%s] 读取媒体文件信息, 未找到指定文件: filepath = %s', requestId, filepath);
      throw new MediaException('未找到指定文件', { cause: { filepath } });
    }

    const command = this.readMediaCommand.replace(':input', basename(filepath));
    const cwd = dirname(filepath);
    this.logger.info('[%s] 读取媒体文件信息: command = %s, cwd = %s', requestId, command, cwd);
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

  readMediaByUrl(url: string): IMedia {
    const requestId = this.ctx.getRequestId();
    if (!isURL(url)) {
      this.logger.error('[%s] 读取媒体文件信息, 指定URL格式无效: url = %s', requestId, url);
      throw new MediaException('未找到指定文件', { cause: { url } });
    }

    const command = this.readMediaCommand.replace(':input', url);
    this.logger.info('[%s] 读取媒体文件信息: command = %s', requestId, command);

    try {
      const stdout = execSync(command);
      const media = plainToInstance(Media, JSON.parse(stdout.toString()));
      this.logger.debug('[%s] 读取媒体文件信息: media = %j', requestId, media);
      return media;
    } catch (error) {
      this.logger.error('[%s] 读取媒体文件信息, 异常: error = %o', requestId, error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }
}
