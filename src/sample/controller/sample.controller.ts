import { SampleQueryDto } from '../dto/sample.dto';
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';

@Controller('/api/sample')
export class SampleController {
  @Get()
  actionQueryValidation(@Query(new ValidationPipe()) query: SampleQueryDto): string {
    return JSON.stringify(query);
  }
}
