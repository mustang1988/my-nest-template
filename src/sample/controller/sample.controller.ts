import { SampleQueryDto } from '../dto/sample.dto';
import { SampleGuard } from '../guard/sample.guard';
import { SampleService } from '../service/sample.service';
import { SampleEntity } from '../entity/sample.default.entity';
import { Cookies } from 'src/common/decorator/cookies.decorator';
import { JsonResp } from 'src/common/decorator/json-response.decorator';
import { PerformanceInterceptor } from '../../common/interceptor/performance.interceptor';
import { FileInterceptor, type StorageFile, UploadedFile } from '@blazity/nest-file-fastify';
import { Controller, Get, Header, HttpCode, Param, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';

@Controller('/api/sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  // #region 返回非JSON数据示例
  @Get('/raw')
  @JsonResp(false)
  /**
   * 此处故意设置响应头Content-Type为application/json, 响应Body并不是JSON字符串, 可用于BigintSupportResponseTransformer的异常测试
   */
  @Header('Content-Type', 'application/json')
  actionRawResponse() {
    return 'hello world';
  }
  // #endregion

  // #region @Cookies() 示例
  @Get()
  actionQueryValidation(@Query() query: SampleQueryDto, @Cookies() cookie: Record<string, string | undefined>): string {
    return JSON.stringify({ query, cookie });
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
  @UseGuards(SampleGuard)
  @HttpCode(200)
  @UseInterceptors(PerformanceInterceptor, FileInterceptor('file'))
  async actionUploadFile(@UploadedFile() file: StorageFile) {
    return {
      size: file.size,
      mime: file.mimetype,
      fieldname: file.fieldname,
    };
  }
  // #endregion
}
