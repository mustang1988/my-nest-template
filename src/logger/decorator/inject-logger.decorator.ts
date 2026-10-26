import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

/**
 * 注入Logger实例
 */
export const InjectLogger = () => Inject(WINSTON_MODULE_PROVIDER);
