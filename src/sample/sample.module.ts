import { Module } from '@nestjs/common';
import { SampleController } from './controller/sample.controller';

/**
 * 示例模块
 */
@Module({
  controllers: [SampleController],
})
export class SampleModule {}
