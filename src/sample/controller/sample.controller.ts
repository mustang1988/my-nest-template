import { SampleQueryDto } from '../dto/sample.dto';
import { SampleService } from '../service/sample.service';
import { SampleEntity } from '../entity/sample.default.entity';
import { FileInterceptor, type StorageFile, UploadedFile } from '@blazity/nest-file-fastify';
import { Controller, Get, Inject, Param, ParseIntPipe, Post, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';

@Controller('/api/sample')
export class SampleController {
  constructor(@Inject() private readonly sampleService: SampleService) {}

  // #region 参数校验示例
  @Get()
  actionQueryValidation(@Query(new ValidationPipe()) query: SampleQueryDto): string {
    return JSON.stringify(query);
  }
  // #endregion

  // #region 数据库查询 -> 事件委托发布 -> 事件委托处理 -> 队列消息发送 -> 队列消息消费 流程示例
  @Get('/:id')
  async actionViewSample(@Param('id', new ParseIntPipe()) id: number): Promise<SampleEntity> {
    return await this.sampleService.viewSampleOrThrow(id);
  }
  // #endregion

  // #region 单文件上传API示例
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async actionUploadFile(@UploadedFile() file: StorageFile) {
    return {
      size: file.size,
      mime: file.mimetype,
      fieldname: file.fieldname,
    };
  }
  // #endregion
}
