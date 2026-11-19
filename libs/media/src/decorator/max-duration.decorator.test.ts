import { basename } from 'node:path';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MaxDuration } from './max-duration.decorator';
import { MediaService } from '../service/media.service';
import { ConfigurationModule } from '@pgu/configuration';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { InternationalizationModule } from '@pgu/internationalization';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';

describe(basename(__filename), () => {
  class TestClass {
    @MaxDuration(60)
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

  it('视频URL(时长6.334秒)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] /* duration: 6.334 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
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

  it('图片URL(图片媒体无时长)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地视频文件(时长6.334秒)', async () => {
    const dto = plainToInstance(TestClass, { media: localVideoFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
