import { basename } from 'node:path';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { ConfigurationModule } from '@pgu/configuration';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MaxAudioDuration } from './max-audio-duration.decorator';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { InternationalizationModule } from '@pgu/internationalization';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';

describe(basename(__filename), () => {
  class TestClass {
    @MaxAudioDuration(120)
    @IsNotEmpty()
    media: string;
  }

  let mediaModule: TestingModule;
  let mediaService: MediaService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localAudioFilepath = '';

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

  it('音频URL(时长10.584秒)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[0] /* duration: 10.584 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('音频URL(时长142.56秒超出上限)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[1] /* duration: 142.556708 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('视频URL(音频流时长5.013秒)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[1] /* 音频流duration: 5.013 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('本地音频文件(时长10.584秒)', async () => {
    const dto = plainToInstance(TestClass, { media: localAudioFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
