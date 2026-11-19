import sharp from 'sharp';
import { Logger } from 'winston';
import { Injectable } from '@nestjs/common';
import { ContextService } from '@pgu/context';
import { MediaService } from './media.service';
import { MediaException } from '../exception/media.exception';
import { InjectLogger, LoggingPerformance } from '@pgu/logger';
import type { IImageCropOptions } from '../interface/image-crop-options.interface';
import type { IImageExtendOptions } from '../interface/image-extend-options.interface';
import type { IImageResizeOptions } from '../interface/image-resize-options.interface';

/**
 * 图片处理服务
 */
@Injectable()
export class ImageProcessingService {
  constructor(
    private readonly ctx: ContextService,
    private readonly mediaService: MediaService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  /**
   * 图片文件尺寸调整
   * @param inputFilepath 输入图片文件路径
   * @param outputFilepath 输出图片文件路径
   * @param options 尺寸调整选项
   * @return 输出图片文件路径
   */
  @LoggingPerformance()
  async resize(inputFilepath: string, outputFilepath: string, options: IImageResizeOptions): Promise<string> {
    const requestId = this.ctx.getRequestId();
    this.logger.debug(
      '[%s] 图片文件尺寸调整, 入参: inputFilepath = %s, outputFilepath = %s, options = %o',
      requestId,
      inputFilepath,
      outputFilepath,
      options,
    );

    try {
      const media = await this.mediaService.readMediaByFilepath(inputFilepath);
      if (!media.isImageMedia()) {
        this.logger.error('[%s] 图片文件尺寸调整, 输入文件不是图片: inputFilepath = %s', requestId, inputFilepath);
        throw new MediaException('输入文件不是图片', { cause: inputFilepath });
      }

      const output = await sharp(inputFilepath).resize(options).toFile(outputFilepath);
      this.logger.debug('[%s] 图片文件尺寸调整, 输出: output = %j', requestId, output);
      return await outputFilepath;
    } catch (error) {
      if (error instanceof MediaException) {
        throw error;
      }
      this.logger.error('[%s] 图片文件尺寸调整, 异常: error = %o', requestId, error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }

  /**
   * 图片文件扩展
   * @param inputFilepath 输入图片文件路径
   * @param outputFilepath 输出图片文件路径
   * @param options 图片扩展选项/扩展像素数
   * @return 输出图片文件路径
   */
  @LoggingPerformance()
  async extend(inputFilepath: string, outputFilepath: string, options: number | IImageExtendOptions): Promise<string> {
    const requestId = this.ctx.getRequestId();
    this.logger.debug(
      '[%s] 图片文件扩展, 入参: inputFilepath = %s, outputFilepath = %s, options = %j',
      requestId,
      inputFilepath,
      outputFilepath,
      options,
    );

    try {
      const media = await this.mediaService.readMediaByFilepath(inputFilepath);
      if (!media.isImageMedia()) {
        this.logger.error('[%s] 图片文件扩展, 输入文件不是图片: inputFilepath = %s', requestId, inputFilepath);
        throw new MediaException('输入文件不是图片', { cause: inputFilepath });
      }

      const output = await sharp(inputFilepath).extend(options).toFile(outputFilepath);
      this.logger.debug('[%s] 图片文件扩展, 输出: output = %j', requestId, output);
      return await outputFilepath;
    } catch (error) {
      if (error instanceof MediaException) {
        throw error;
      }
      this.logger.error('[%s] 图片文件扩展, 异常: error = %o', requestId, error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }

  /**
   * 图片文件裁切
   * @param inputFilepath 输入图片文件路径
   * @param outputFilepath 输出图片文件路径
   * @param options 图片裁切选项
   * @return 输出图片文件路径
   */
  @LoggingPerformance()
  async crop(inputFilepath: string, outputFilepath: string, options: IImageCropOptions): Promise<string> {
    const requestId = this.ctx.getRequestId();
    this.logger.debug(
      '[%s] 图片文件裁切, 入参: inputFilepath = %s, outputFilepath = %s, options = %j',
      requestId,
      inputFilepath,
      outputFilepath,
      options,
    );

    try {
      const media = await this.mediaService.readMediaByFilepath(inputFilepath);
      if (!media.isImageMedia()) {
        this.logger.error('[%s] 图片文件裁切, 输入文件不是图片: inputFilepath = %s', requestId, inputFilepath);
        throw new MediaException('输入文件不是图片', { cause: inputFilepath });
      }

      const output = await sharp(inputFilepath).extract(options).toFile(outputFilepath);
      this.logger.debug('[%s] 图片文件裁切, 输出: output = %j', requestId, output);
      return await outputFilepath;
    } catch (error) {
      if (error instanceof MediaException) {
        throw error;
      }
      this.logger.error('[%s] 图片文件裁切, 异常: error = %o', requestId, error);
      throw new MediaException((error as Error).message, { cause: error });
    }
  }
}
