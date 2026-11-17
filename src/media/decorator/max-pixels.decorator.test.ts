import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { MaxPixels } from './max-pixels.decorator';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { MediaTestUtil, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @MaxPixels(2000000)
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
    localImageFilepath = await MediaTestUtil.downloadTestAsset(TEST_IMAGES[0]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localImageFilepath);
    await mediaModule.close();
  });

  it('图片URL(896x1200共1075200像素)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL(1456x816共1188096像素)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[1] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(3840x2160共8294400像素超出上限)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地图片文件(896x1200共1075200像素)', async () => {
    const dto = plainToInstance(TestClass, { media: localImageFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
