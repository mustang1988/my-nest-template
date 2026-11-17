import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { ClsService } from 'nestjs-cls';
import { randomUUID } from 'node:crypto';
import { MediaModule } from '../media.module';
import { MediaService } from './media.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { MediaException } from '../exception/media.exception';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';
import { MediaTestUtil, TEST_AUDIOS, TEST_IMAGES, TEST_SUBTITLES, TEST_VIDEOS } from '../media.module.test';

describe(basename(__filename), () => {
  let mediaModule: TestingModule;
  let mediaService: MediaService;
  let cls: ClsService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localVideoFilepath: string;
  let localAudioFilepath: string;
  let localImageFilepath: string;
  let localSubtitleFilepath: string;

  beforeAll(async () => {
    mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
    cls = mediaModule.get(ClsService);
    expect(cls);
    mediaService = mediaModule.get(MediaService);
    expect(mediaService);
    localVideoFilepath = await MediaTestUtil.downloadTestAsset(TEST_VIDEOS[0]);
    localAudioFilepath = await MediaTestUtil.downloadTestAsset(TEST_AUDIOS[0]);
    localImageFilepath = await MediaTestUtil.downloadTestAsset(TEST_IMAGES[0]);
    localSubtitleFilepath = await MediaTestUtil.downloadTestAsset(TEST_SUBTITLES[0]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(localVideoFilepath, localAudioFilepath, localImageFilepath, localSubtitleFilepath);
    await mediaModule.close();
  });

  describe('readMedia()', () => {
    it('URL输入分发到readMediaByUrl', async () => {
      const result = await mediaService.readMedia(TEST_VIDEOS[1]);
      expect(result);
    });

    it('文件路径输入分发到readMediaByFilepath', async () => {
      const result = await mediaService.readMedia(localVideoFilepath);
      expect(result);
    });
  });

  describe('readMediaByFilepath()', () => {
    it('本地视频文件', async () => {
      const result = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(result);
    });

    it('本地音频文件', async () => {
      const result = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(result);
    });

    it('本地图片文件', async () => {
      const result = await mediaService.readMediaByFilepath(localImageFilepath);
      expect(result);
    });

    it('本地字幕文件', async () => {
      const result = await mediaService.readMediaByFilepath(localSubtitleFilepath);
      expect(result);
    });

    it('文件不存在', async () => {
      try {
        const filepath = `C:\\${randomUUID()}.mp4`;
        await mediaService.readMediaByFilepath(filepath);
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });
  });

  describe('readMediaByUrl()', () => {
    it('视频URL', async () => {
      const result = await mediaService.readMediaByUrl(TEST_VIDEOS[1] /* 约38.87MB */);
      expect(result);
    });

    it('音频URL', async () => {
      const result = await mediaService.readMediaByUrl(TEST_AUDIOS[0]);
      expect(result);
    });

    it('图片URL', async () => {
      const result = await mediaService.readMediaByUrl(TEST_IMAGES[0]);
      expect(result);
    });

    it('字幕URL', async () => {
      const result = await mediaService.readMediaByUrl(TEST_SUBTITLES[0]);
      expect(result);
    });

    it('URL无法访问', async () => {
      try {
        await mediaService.readMediaByUrl(faker.internet.url());
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });

    it('URL格式无效', async () => {
      try {
        await mediaService.readMediaByUrl(randomUUID());
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });
  });
});
