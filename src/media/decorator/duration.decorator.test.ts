import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { Duration } from './duration.decorator';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { MediaService } from '../service/media.service';
import { ContextModule } from 'src/context/context.module';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @Duration(5, 120)
    @IsNotEmpty()
    media: string;
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
      media: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4' /* duration: 86 */,
    });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片文件路径', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频文件路径', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus' /* duration: 142.5 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('视频URL', async () => {
    const dto = plainToInstance(TestClass, { media: 'http://10.50.2.35:9001/test/1518ccdd-c83c-4f6c-a0e2-6f5e4cff06f5.mp4' /* duratuin: 5 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片URL', async () => {
    const dto = plainToInstance(TestClass, { media: 'http://10.50.2.35:9001/test/061209205678761009.png' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频URL', async () => {
    const dto = plainToInstance(TestClass, { media: 'http://10.50.2.35:9001/test/r2v_tea_audio1.mp3' });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
