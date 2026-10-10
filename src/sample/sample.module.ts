import { Module } from '@nestjs/common';
import { SampleService } from './service/sample.service';
import { SampleConsumer } from './consumer/sample.consumer';
import { SampleController } from './controller/sample.controller';
import { SampleEventHandler } from './event-handler/sample.event-handler';

/**
 * 示例模块
 */
@Module({
  providers: [SampleService, SampleEventHandler],
  controllers: [SampleController, SampleConsumer],
})
export class SampleModule {}
