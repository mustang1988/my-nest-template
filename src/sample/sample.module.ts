import { Module } from '@nestjs/common';
import { SampleController } from './controller/sample.controller';

@Module({
  controllers: [SampleController],
})
export class SampleModule {}
