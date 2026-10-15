import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [
    /**
     * NestJS 事件驱动模块
     */
    EventEmitterModule.forRoot({ global: true }),
  ],
})
export class EventModule {}
