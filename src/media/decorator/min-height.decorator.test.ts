import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { MinHeight } from './min-height.decorator';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { MediaTestUtil, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @MinHeight(1000)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流索引: 仅校验第1条视频流的画面尺寸
   */
  class StreamIndexTestClass {
    @MinHeight(1100, 0)
    @IsNotEmpty()
    media: string;
  }

  let mediaModule: TestingModule;
  let mediaService: MediaService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localVideoFilepath = '';

  beforeAll(async () => {
    mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
    mediaService = mediaModule.get(MediaService);
    expect(mediaService);
    useContainer(mediaModule, { fallbackOnErrors: true });
    /**
     * 将Nest Logger委托到winston
     *
     * TestingModule编译时会把全局Logger覆盖为TestingLogger(测试通过时静默丢弃所有日志),
     * @LoggingPerformance等直接使用Nest Logger输出的日志会因此不可见, 委托到winston后恢复正常输出
     */
    mediaModule.useLogger(mediaModule.get(WINSTON_MODULE_NEST_PROVIDER));
    localVideoFilepath = await MediaTestUtil.downloadTestAsset(TEST_VIDEOS[0]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localVideoFilepath);
    await mediaModule.close();
  });

  it('视频URL(高度2160px)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL(高度816px低于下限)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[1] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地视频文件(高度2160px)', async () => {
    const dto = plainToInstance(TestClass, { media: localVideoFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
  it('指定流索引(jpg高度1200px)', async () => {
    const dto = plainToInstance(StreamIndexTestClass, { media: TEST_IMAGES[0] /* 896x1200 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
