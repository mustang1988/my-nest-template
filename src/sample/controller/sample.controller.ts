import { SampleQueryDto } from '../dto/sample.dto';
import { SampleService } from '../service/sample.service';
import { SampleEntity } from '../entity/sample.default.entity';
import { FileInterceptor, type StorageFile, UploadedFile } from '@blazity/nest-file-fastify';
import { Controller, Get, Inject, Param, ParseIntPipe, Post, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';

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

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async actionUploadFile(@UploadedFile() file: StorageFile) {
    console.log(file);
    return {
      size: file.size,
      mime: file.mimetype,
      fieldname: file.fieldname,
    };
  }
}
