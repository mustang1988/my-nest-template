import { basename } from 'node:path';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { MediaModule } from '../media.module';
import { IsAudio } from './is-audio.decorator';
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
    @IsAudio()
    @IsNotEmpty()
    media: string;
  }

  let mediaModule: TestingModule;
  let mediaService: MediaService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localAudioFilepath: string;

  beforeAll(async () => {
    mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
    mediaService = mediaModule.get(MediaService);
    expect(mediaService);
    useContainer(mediaModule, { fallbackOnErrors: true });
    mediaModule.useLogger(mediaModule.get(WINSTON_MODULE_NEST_PROVIDER));
    localAudioFilepath = await MediaTestUtil.downloadTestAsset(TEST_AUDIOS[0]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localAudioFilepath);
    await mediaModule.close();
  });

  it('音频URL(mp3)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('音频URL(opus)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[1] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('本地音频文件', async () => {
    const dto = plainToInstance(TestClass, { media: localAudioFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(含音频流但为视频媒体)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] /* 含eac3音频流 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('图片URL', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });
});
