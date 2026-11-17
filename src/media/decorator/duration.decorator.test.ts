import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { ECodecType } from '../media.constant';
import { Duration } from './duration.decorator';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_SUBTITLES, TEST_VIDEOS } from '../media.module.test';

describe(basename(__filename), () => {
  class TestClass {
    @Duration(5, 120)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流类型: 校验所有音频流的流级时长
   */
  class AudioStreamTestClass {
    @Duration(0, 600, ECodecType.AUDIO)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流类型与流索引: 仅校验第1条视频流的流级时长
   */
  class VideoStreamIndexTestClass {
    @Duration(0, 600, ECodecType.VIDEO, 0)
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
    /**
     * 将Nest Logger委托到winston
     *
     * TestingModule编译时会把全局Logger覆盖为TestingLogger(测试通过时静默丢弃所有日志),
     * @LoggingPerformance等直接使用Nest Logger输出的日志会因此不可见, 委托到winston后恢复正常输出
     */
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

  it('视频URL(时长5.02秒)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[1] /* duration: 5.021683 */ });
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

  it('字幕URL(无音视频流, 时长未知)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_SUBTITLES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地视频文件(时长6.334秒)', async () => {
    const dto = plainToInstance(TestClass, { media: localVideoFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('指定流类型(所有音频流, 音频流时长5.013秒)', async () => {
    const dto = plainToInstance(AudioStreamTestClass, { media: TEST_VIDEOS[1] /* 音频流duration: 5.013 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('指定流类型(流级时长缺失, 无法确认校验结果)', async () => {
    const dto = plainToInstance(AudioStreamTestClass, { media: TEST_VIDEOS[0] /* mkv流级无duration字段 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('指定流类型与流索引(第1条视频流, 视频流时长5.022秒)', async () => {
    const dto = plainToInstance(VideoStreamIndexTestClass, { media: TEST_VIDEOS[1] /* 视频流duration: 5.021683 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
