import { SampleQueryDto } from '../dto/sample.dto';
import { SampleService } from '../service/sample.service';
import { SampleEntity } from '../entity/sample.default.entity';
import { Controller, Get, Inject, Param, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';

@Controller('/api/sample')
export class SampleController {
  constructor(@Inject() private readonly sampleService: SampleService) {}

  @Get()
  actionQueryValidation(@Query(new ValidationPipe()) query: SampleQueryDto): string {
    return JSON.stringify(query);
  }

  @Get('/:id')
  async actionViewSample(@Param('id', new ParseIntPipe()) id: number): Promise<SampleEntity> {
    return await this.sampleService.viewSampleOrThrow(id);
  }
}
