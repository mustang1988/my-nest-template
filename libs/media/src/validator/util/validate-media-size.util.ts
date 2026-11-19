import bytes from 'bytes';
import { IMedia } from '../../interface/media.interface';

/**
 * 待校验媒体文件大小选取工具类
 */
export class ValidateMediaSizeUtil {
  /**
   * 解析大小约束为字节数
   *
   * @param sizeConstraint 大小约束; 数值按字节, 字符串按bytes库格式(如'10MB', '1.5GB'), 详见[bytes](https://www.npmjs.com/package/bytes)
   * @return 字节数; 约束无法解析或非正数时返回undefined
   */
  static parseConstraint(sizeConstraint: string | number): number | undefined {
    const sizeInBytes = bytes.parse(sizeConstraint);
    return sizeInBytes !== null && Number.isFinite(sizeInBytes) && sizeInBytes > 0 ? sizeInBytes : undefined;
  }

  /**
   * 获取待校验的媒体文件大小
   *
   * 文件大小来自ffprobe输出的format.size(容器级属性, 对本地文件与URL输入均有效)
   *
   * @param media 媒体信息
   * @return 媒体文件大小(单位: 字节); 大小未知或非法时返回undefined
   */
  static getSize(media: IMedia): number | undefined {
    const size = media.format?.size;
    return size !== undefined && !Number.isNaN(size) && size >= 0 ? size : undefined;
  }
}
