import { Module } from '@nestjs/common';
import { SampleService } from './service/sample.service';
import { SampleController } from './controller/sample.controller';

/**
 * 示例模块
 */
@Module({
  providers: [SampleService],
  controllers: [SampleController],
})
export class SampleModule {}
