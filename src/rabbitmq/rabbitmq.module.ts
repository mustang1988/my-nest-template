import { Global, Module } from '@nestjs/common';
import { rabbitmqClients } from './service/rabbitmq-client';

/**
 * Rabbitmq模块
 *
 * - 全局模块
 */
@Global()
@Module({
  providers: [...rabbitmqClients],
  exports: [...rabbitmqClients],
})
export class RabbitmqModule {}
