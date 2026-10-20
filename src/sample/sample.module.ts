import { Module } from '@nestjs/common';
import { SampleGuard } from './guard/sample.guard';
import { SampleService } from './service/sample.service';
import { SampleGateway } from './gateway/sample-socket-io.gateway';
import { SampleConsumer } from './consumer/sample.consumer';
import { SampleScheduler } from './scheduler/sample.scheduler';
import { SampleController } from './controller/sample.controller';
import { SampleEventHandler } from './event-handler/sample.event-handler';

/**
 * 示例模块
 */
@Module({
  providers: [SampleService, SampleEventHandler, SampleScheduler, SampleGuard, SampleGateway],
  controllers: [SampleController, SampleConsumer],
})
export class SampleModule {}
