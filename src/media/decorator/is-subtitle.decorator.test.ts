import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { IsSubtitle } from './is-subtitle.decorator';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { MediaTestUtil, TEST_AUDIOS, TEST_SUBTITLES, TEST_VIDEOS } from '../media.module.test';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @IsSubtitle()
    @IsNotEmpty()
    media: string;
  }

  let mediaModule: TestingModule;
  let mediaService: MediaService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localSubtitleFilepath: string;

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
    localSubtitleFilepath = await MediaTestUtil.downloadTestAsset(TEST_SUBTITLES[0]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localSubtitleFilepath);
    await mediaModule.close();
  });

  it('字幕URL(srt)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_SUBTITLES[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('字幕URL(ass)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_SUBTITLES[1] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('本地字幕文件', async () => {
    const dto = plainToInstance(TestClass, { media: localSubtitleFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(含字幕流但为视频媒体)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] /* 含subrip字幕流 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频URL', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_AUDIOS[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });
});
