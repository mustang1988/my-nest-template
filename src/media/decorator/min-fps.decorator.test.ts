import { basename } from 'node:path';
import { MinFps } from './min-fps.decorator';
import { MediaModule } from '../media.module';
import { plainToInstance } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IsNotEmpty, useContainer, validate } from 'class-validator';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { MediaTestUtil, TEST_IMAGES, TEST_VIDEOS } from '../media.module.test';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  class TestClass {
    @MinFps(30)
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

  it('视频URL(帧率59.94)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[1] /* 60000/1001 */ });
    const result = await validate(dto);
    expect(result).toStrictEqual([]);
  });

  it('视频URL(帧率23.976低于下限)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_VIDEOS[0] /* 24000/1001 */ });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('图片URL(图片媒体不参与帧率校验)', async () => {
    const dto = plainToInstance(TestClass, { media: TEST_IMAGES[0] });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });

  it('本地视频文件(帧率23.976低于下限)', async () => {
    const dto = plainToInstance(TestClass, { media: localVideoFilepath });
    const result = await validate(dto);
    expect(result).not.toStrictEqual([]);
  });
});
