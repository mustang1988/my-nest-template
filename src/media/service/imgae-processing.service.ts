import sharp from 'sharp';
import { Logger } from 'winston';
import { Injectable } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaException } from '../exception/media.exception';
import { ContextService } from 'src/context/service/context.service';
import { InjectLogger } from 'src/logger/decorator/inject-logger.decorator';
import { IImageResizeOptions } from '../interface/image-resize-options.interface';

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
  async resize(inputFilepath: string, outputFilepath: string, options: IImageResizeOptions): Promise<string> {
    const requestId = this.ctx.getRequestId();
    this.logger.debug('[%s] 图片文件尺寸调整, 入参: inputFilepath = %s, outputFilepath = %s', requestId, inputFilepath, outputFilepath);

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
}
