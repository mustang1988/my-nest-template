import { Inject } from '@nestjs/common';
import { getS3ClientToken } from '../s3-storage.constant';

/**
 * 注入指定名称的S3客户端
 * @param name S3客户端名称
 */
export const InjectS3Client = (name: string) => Inject(getS3ClientToken(name));
