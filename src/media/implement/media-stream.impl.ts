import { Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

/**
 * 媒体流
 *
 * 空白基类, 用于混合类型@Type()装饰器的类型区分
 */
export class MediaStream {
  @Type(() => String)
  @IsString()
  @IsOptional()
  codec_type: string;
}
