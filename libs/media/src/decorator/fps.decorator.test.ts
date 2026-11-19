import { basename } from 'node:path';
import { Fps } from './fps.decorator';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { ConfigurationModule } from '@pgu/configuration';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InternationalizationModule } from '@pgu/internationalization';
import { IsNotEmpty, IsOptional, useContainer, validate } from 'class-validator';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';

describe(basename(__filename), () => {
  class TestClass {
    @Fps(23, 24)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流索引: 仅校验第1条视频流的帧率
   */
  class StreamIndexTestClass {
    @Fps(23, 24, 0)
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

  it('视频URL(帧率23.976)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] /* 24000/1001 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(帧率59.94超出范围)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[1] /* 60000/1001 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('图片URL(图片媒体不参与帧率校验)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频URL(无视频流)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地视频文件(帧率23.976)', async () => {
    const dto = plainToInstance(TestClass, { media: localVideoFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('指定流索引(帧率23.976)', async () => {
    const dto = plainToInstance(StreamIndexTestClass, { media: TEST_VIDEOS[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
