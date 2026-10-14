import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

/**
 * 注入日志
 */
export const InjectLogger = () => Inject(WINSTON_MODULE_PROVIDER);
