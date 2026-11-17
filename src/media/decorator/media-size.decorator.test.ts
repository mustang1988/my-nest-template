import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { MediaSize } from './media-size.decorator';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { MediaTestUtil, TEST_AUDIOS, TEST_VIDEOS } from '../media.module.test';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @MediaSize('8MB', '10MB')
    @IsNotEmpty()
    media: string;
  }

  /**
   * 字节数值形式的约束
   */
  class BytesConstraintTestClass {
    @MediaSize(100000, 200000)
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

  it('视频URL(约8.63MB)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] /* size: 9044599字节 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(约38.87MB超出上限)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[1] /* size: 40765831字节 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('字节数值约束(171277字节)', async () => {
    const dto = plainToInstance(BytesConstraintTestClass, { media: TEST_AUDIOS[0] /* size: 171277字节 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('本地视频文件(约8.63MB)', async () => {
    const dto = plainToInstance(TestClass, { media: localVideoFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('文件不存在', async () => {
    const dto = plainToInstance(TestClass, { media: 'C:\\not-exists-media-file.mp4' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });
});
