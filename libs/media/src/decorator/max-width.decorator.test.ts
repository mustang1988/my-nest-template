import { basename } from 'node:path';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { MediaModule } from '../media.module';
import { MaxWidth } from './max-width.decorator';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { ConfigurationModule } from '@pgu/configuration';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { InternationalizationModule } from '@pgu/internationalization';
import { MediaTestUtil, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';

describe(basename(__filename), () => {
  class TestClass {
    @MaxWidth(2000)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流索引: 仅校验第1条视频流的画面尺寸
   */
  class StreamIndexTestClass {
    @MaxWidth(1000, 0)
    @IsNotEmpty()
    media: string;
  }

  let mediaModule: TestingModule;
  let mediaService: MediaService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localImageFilepath = '';

  beforeAll(async () => {
    mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
    mediaService = mediaModule.get(MediaService);
    expect(mediaService);
    useContainer(mediaModule, { fallbackOnErrors: true });
    mediaModule.useLogger(mediaModule.get(WINSTON_MODULE_NEST_PROVIDER));
    localImageFilepath = await MediaTestUtil.downloadTestAsset(TEST_IMAGES[1]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localImageFilepath);
    await mediaModule.close();
  });

  it('图片URL(宽度1456px)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[1] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL(宽度896px)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(宽度3840px超出上限)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地图片文件(宽度1456px)', async () => {
    const dto = plainToInstance(TestClass, { media: localImageFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
  it('指定流索引(jpg宽度896px)', async () => {
    const dto = plainToInstance(StreamIndexTestClass, { media: TEST_IMAGES[0] /* 896x1200 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
