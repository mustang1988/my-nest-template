import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { AspectRatio } from './aspect-ratio.decorator';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @AspectRatio(1.7, 1.8)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流索引: 仅校验第1条视频流的宽高比
   */
  class StreamIndexTestClass {
    @AspectRatio(0.7, 0.8, 0)
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
    localImageFilepath = await MediaTestUtil.downloadTestAsset(TEST_IMAGES[1]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localImageFilepath);
    await mediaModule.close();
  });

  it('视频URL(16:9宽高比约1.778)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL(png 1456x816宽高比约1.784)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[1] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL(jpg 896x1200宽高比约0.747)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频URL(无视频流)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地图片文件(png宽高比约1.784)', async () => {
    const dto = plainToInstance(TestClass, { media: localImageFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('指定流索引(jpg宽高比约0.747)', async () => {
    const dto = plainToInstance(StreamIndexTestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
