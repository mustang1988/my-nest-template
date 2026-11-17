import { basename } from 'node:path';
import { Pixels } from './pixels.decorator';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @Pixels(3840 * 2160 - 1, 3840 * 2160 + 1)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流索引: 仅校验第1条视频流的总像素数
   */
  class StreamIndexTestClass {
    @Pixels(896 * 1200 - 1, 896 * 1200 + 1, 0)
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
    localVideoFilepath = await MediaTestUtil.downloadTestAsset(TEST_VIDEOS[0]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localVideoFilepath);
    await mediaModule.close();
  });

  it('视频URL(3840x2160共8294400像素)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(3840x2160共8294400像素)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[1] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL(896x1200共1075200像素低于下限)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频URL(无视频流)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地视频文件(3840x2160共8294400像素)', async () => {
    const dto = plainToInstance(TestClass, { media: localVideoFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('指定流索引(896x1200共1075200像素)', async () => {
    const dto = plainToInstance(StreamIndexTestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
