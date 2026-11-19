import { basename } from 'node:path';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { MediaModule } from '../media.module';
import { IsCodec } from './is-codec.decorator';
import { plainToInstance } from 'class-transformer';
import { ECodecType } from '../enum/codec-type.enum';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { ConfigurationModule } from '@pgu/configuration';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InternationalizationModule } from '@pgu/internationalization';
import { IsNotEmpty, IsOptional, useContainer, validate } from 'class-validator';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';

describe(basename(__filename), () => {
  class TestClass {
    @IsCodec('hevc', ECodecType.VIDEO) // 所有视频流均为hevc编码
    @IsCodec('aac', ECodecType.AUDIO) // 所有音频流均为aac编码
    @IsOptional()
    videoInHevcAndAac?: string;

    @IsCodec('eac3', ECodecType.AUDIO, 0) // 第一个音频流为eac3编码
    @IsOptional()
    audioInEac3?: string;

    @IsCodec('mp3', ECodecType.AUDIO) // 所有音频流均为mp3编码
    @IsOptional()
    audioInMp3?: string;
  }

  /**
   * 编码器名称数组形式
   */
  class ArrayCodecTestClass {
    @IsCodec(['h264', 'hevc'], ECodecType.VIDEO) // 视频流编码器为h264或hevc之一
    @IsOptional()
    videoInArray?: string;

    @IsCodec(['h264', 'vp9'], ECodecType.VIDEO) // 视频流编码器不在数组中
    @IsOptional()
    videoNotInArray?: string;

    @IsCodec(['H.265 / HEVC (High Efficiency Video Coding)'], ECodecType.VIDEO) // 编码器全名命中数组
    @IsOptional()
    videoByLongName?: string;

    @IsCodec(['aac', 'opus'], ECodecType.AUDIO) // 音频流编码器为aac或opus之一
    @IsOptional()
    audioInArray?: string;
  }

  let mediaModule: TestingModule;
  let mediaService: MediaService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localVideoFilepath: string;

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

  it('视频URL(hevc视频流+aac音频流)', async () => {
    const dto = plainToInstance(TestClass, { videoInHevcAndAac: TEST_VIDEOS[1] /* hevc+aac */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(指定流索引eac3音频流)', async () => {
    const dto = plainToInstance(TestClass, { audioInEac3: TEST_VIDEOS[0] /* eac3音频流 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('本地视频文件(hevc视频流)', async () => {
    const dto = plainToInstance(TestClass, { videoInHevcAndAac: localVideoFilepath });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]); // video_1音频流为eac3非aac
  });

  it('本地视频文件(指定流索引eac3音频流)', async () => {
    const dto = plainToInstance(TestClass, { audioInEac3: localVideoFilepath });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('音频URL(mp3)', async () => {
    const dto = plainToInstance(TestClass, { audioInMp3: TEST_AUDIOS[0] });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL(无音频流, 音频编码校验失败)', async () => {
    const dto = plainToInstance(TestClass, { audioInMp3: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  describe('编码器名称数组', () => {
    it('视频URL(hevc在数组中)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, { videoInArray: TEST_VIDEOS[0] });
      const result = await validate(dto);
      expect(result).toStrictEqual([]);
    });

    it('视频URL(hevc不在数组中)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, { videoNotInArray: TEST_VIDEOS[0] });
      const result = await validate(dto);
      expect(result).not.toStrictEqual([]);
    });

    it('视频URL(编码器全名命中数组)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, { videoByLongName: TEST_VIDEOS[0] });
      const result = await validate(dto);
      expect(result).toStrictEqual([]);
    });

    it('音频URL(opus在数组中)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, { audioInArray: TEST_AUDIOS[1] });
      const result = await validate(dto);
      expect(result).toStrictEqual([]);
    });
  });
});
