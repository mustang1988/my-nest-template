import { basename } from 'node:path';
import { MediaModule } from '../media.module';
import { AspectRatio } from './aspect-ratio.decorator';
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
    @AspectRatio(1.7, 1.8)
    @IsNotEmpty()
    media: string;
  }

  /**
   * 指定流索引: 仅校验第1条视频流的宽高比
   */
  class StreamIndexTestClass {
    @AspectRatio(0.7, 0.8, 0)
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

  it('视频文件路径(16:9)', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4' });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('图片文件路径(竖图896x1200)', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('音频文件路径(无视频流)', async () => {
    const dto = plainToInstance(TestClass, { media: 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus' });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('图片文件路径(指定流索引, 竖图宽高比约0.747)', async () => {
    const dto = plainToInstance(StreamIndexTestClass, { media: 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png' });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });
});
