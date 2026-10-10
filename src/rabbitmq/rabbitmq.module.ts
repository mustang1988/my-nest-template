import { Global, Module } from '@nestjs/common';
import { rabbitmqClients } from './service/rabbitmq-client';

@Global()
@Module({
  providers: [...rabbitmqClients],
  exports: [...rabbitmqClients],
})
export class RabbitmqModule {}
