import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { IsCodec } from './is-codec.decorator';
import { ECodecType } from '../media.constant';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { IsOptional, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @IsCodec('hevc', ECodecType.VIDEO) // 所有视频流均为hevc编码
    @IsCodec('aac', ECodecType.AUDIO) // 所有音频流均为aac编码
    @IsOptional()
    videoInHevc?: string;

    @IsCodec('aac', ECodecType.AUDIO, 0) // 第一个音频流为aac编码
    @IsOptional()
    audioInAac?: string;
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

  beforeAll(async () => {
    mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
    mediaService = mediaModule.get(MediaService);
    expect(mediaService);
    useContainer(mediaModule, { fallbackOnErrors: true });
  });

  it('视频文件路径', async () => {
    const dto = plainToInstance(TestClass, {
      videoInHevc: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4' /* duration: 86 */,
      audioInAac: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4',
    });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片文件路径', async () => {
    const dto = plainToInstance(TestClass, { videoInHevc: 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频文件路径', async () => {
    const dto = plainToInstance(TestClass, { videoInHevc: 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus' /* duration: 142.5 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('视频URL', async () => {
    const dto = plainToInstance(TestClass, { videoInHevc: 'http://10.50.2.35:9001/test/1518ccdd-c83c-4f6c-a0e2-6f5e4cff06f5.mp4' /* duratuin: 5 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('图片URL', async () => {
    const dto = plainToInstance(TestClass, { videoInHevc: 'http://10.50.2.35:9001/test/061209205678761009.png' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频URL', async () => {
    const dto = plainToInstance(TestClass, { audioInAac: 'http://10.50.2.35:9001/test/r2v_tea_audio1.mp3' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  describe('编码器名称数组', () => {
    it('视频文件路径(hevc在数组中)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, {
        videoInArray: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4',
      });
      const result = await validate(dto);
      expect(result).toStrictEqual([]);
    });

    it('视频文件路径(hevc不在数组中)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, {
        videoNotInArray: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4',
      });
      const result = await validate(dto);
      expect(result).not.toStrictEqual([]);
    });

    it('视频文件路径(编码器全名命中数组)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, {
        videoByLongName: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4',
      });
      const result = await validate(dto);
      expect(result).toStrictEqual([]);
    });

    it('音频文件路径(opus在数组中)', async () => {
      const dto = plainToInstance(ArrayCodecTestClass, {
        audioInArray: 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus',
      });
      const result = await validate(dto);
      expect(result).toStrictEqual([]);
    });
  });
});
