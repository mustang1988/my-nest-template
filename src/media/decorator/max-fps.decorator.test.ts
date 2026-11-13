import { basename } from 'node:path';
import { MaxFps } from './max-fps.decorator';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @MaxFps(30)
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

  it('视频文件路径(帧率59.94超出上限)', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('图片文件路径(图片媒体不参与帧率校验)', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频文件路径(无视频流)', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });
});
