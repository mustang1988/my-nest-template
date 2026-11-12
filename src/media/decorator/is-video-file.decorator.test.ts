import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { IsVideoFile } from './is-video-file.decorator';
import { LoggerModule } from 'src/logger/logger.module';
import { MediaService } from '../service/media.service';
import { ContextModule } from 'src/context/context.module';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @IsVideoFile()
    @IsNotEmpty()
    videoFile: string;
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

  it('视频', async () => {
    const dto = plainToInstance(TestClass, { videoFile: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4' });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片', async () => {
    const dto = plainToInstance(TestClass, { videoFile: 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频', async () => {
    const dto = plainToInstance(TestClass, { videoFile: 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });
});
