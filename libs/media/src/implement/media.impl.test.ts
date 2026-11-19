import { basename } from 'node:path';
import { ClsService } from 'nestjs-cls';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { MediaModule } from '../media.module';
import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { ConfigurationModule } from '@pgu/configuration';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InternationalizationModule } from '@pgu/internationalization';
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
    /**
     * 将Nest Logger委托到winston
     *
     * TestingModule编译时会把全局Logger覆盖为TestingLogger(测试通过时静默丢弃所有日志),
     * @LoggingPerformance等直接使用Nest Logger输出的日志会因此不可见, 委托到winston后恢复正常输出
     */
    mediaModule.useLogger(mediaModule.get(WINSTON_MODULE_NEST_PROVIDER));
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

  describe('getVideoStreams()', () => {
    it('视频(1条视频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media);
      const videoStreams = media.getVideoStreams();
      expect(videoStreams).not.toStrictEqual([]);
      expect(videoStreams.length).toStrictEqual(1);
    });

    it('图片(1条单帧视频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localImageFilepath);
      expect(media);
      const videoStreams = media.getVideoStreams();
      expect(videoStreams).not.toStrictEqual([]);
    });

    it('音频(无视频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(media);
      const videoStreams = media.getVideoStreams();
      expect(videoStreams).toStrictEqual([]);
    });
  });

  describe('getVideoStream(index)', () => {
    it('视频', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media);
      const videoStream = media.getVideoStream(0);
      expect(videoStream).not.toStrictEqual(undefined);
      expect(videoStream?.codec_name).toStrictEqual('hevc');
    });

    it('图片', async () => {
      const media = await mediaService.readMediaByFilepath(localImageFilepath);
      expect(media);
      const videoStream = media.getVideoStream(0);
      expect(videoStream).not.toStrictEqual(undefined);
    });

    it('音频(无视频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(media);
      const videoStream = media.getVideoStream(0);
      expect(videoStream).toStrictEqual(undefined);
    });
  });

  describe('getAudioStreams()', () => {
    it('视频(1条音频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media);
      const audioStreams = media.getAudioStreams();
      expect(audioStreams).not.toStrictEqual([]);
      expect(audioStreams.length).toStrictEqual(1);
    });

    it('图片(无音频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localImageFilepath);
      expect(media);
      const audioStreams = media.getAudioStreams();
      expect(audioStreams).toStrictEqual([]);
    });

    it('音频(1条音频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(media);
      const audioStreams = media.getAudioStreams();
      expect(audioStreams).not.toStrictEqual([]);
    });
  });

  describe('getAudioStream(index)', () => {
    it('视频', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media);
      const audioStream = media.getAudioStream(0);
      expect(audioStream).not.toStrictEqual(undefined);
      expect(audioStream?.codec_name).toStrictEqual('eac3');
    });

    it('图片(无音频流)', async () => {
      const media = await mediaService.readMediaByFilepath(localImageFilepath);
      expect(media);
      const audioStream = media.getAudioStream(0);
      expect(audioStream).toStrictEqual(undefined);
    });

    it('音频', async () => {
      const media = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(media);
      const audioStream = media.getAudioStream(0);
      expect(audioStream).not.toStrictEqual(undefined);
      expect(audioStream?.codec_name).toStrictEqual('mp3');
    });
  });

  describe('getSubtitleStreams()', () => {
    it('视频(1条字幕流)', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media);
      const subtitleStreams = media.getSubtitleStreams();
      expect(subtitleStreams).not.toStrictEqual([]);
      expect(subtitleStreams.length).toStrictEqual(1);
    });

    it('音频(无字幕流)', async () => {
      const media = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(media);
      const subtitleStreams = media.getSubtitleStreams();
      expect(subtitleStreams).toStrictEqual([]);
    });

    it('字幕(1条字幕流)', async () => {
      const media = await mediaService.readMediaByFilepath(localSubtitleFilepath);
      expect(media);
      const subtitleStreams = media.getSubtitleStreams();
      expect(subtitleStreams).not.toStrictEqual([]);
    });
  });

  describe('getSubtitleStream(index)', () => {
    it('视频', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media);
      const subtitleStream = media.getSubtitleStream(0);
      expect(subtitleStream).not.toStrictEqual(undefined);
      expect(subtitleStream?.codec_name).toStrictEqual('subrip');
    });

    it('字幕', async () => {
      const media = await mediaService.readMediaByFilepath(localSubtitleFilepath);
      expect(media);
      const subtitleStream = media.getSubtitleStream(0);
      expect(subtitleStream).not.toStrictEqual(undefined);
      expect(subtitleStream?.codec_name).toStrictEqual('subrip');
    });
  });

  describe('媒体类型判定', () => {
    it('视频', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media.isVideoMedia()).toStrictEqual(true);
      expect(media.isAudioMedia()).toStrictEqual(false);
      expect(media.isImageMedia()).toStrictEqual(false);
      expect(media.isSubtitleMedia()).toStrictEqual(false);
    });

    it('音频', async () => {
      const media = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(media.isVideoMedia()).toStrictEqual(false);
      expect(media.isAudioMedia()).toStrictEqual(true);
      expect(media.isImageMedia()).toStrictEqual(false);
      expect(media.isSubtitleMedia()).toStrictEqual(false);
    });

    it('图片', async () => {
      const media = await mediaService.readMediaByFilepath(localImageFilepath);
      expect(media.isVideoMedia()).toStrictEqual(false);
      expect(media.isAudioMedia()).toStrictEqual(false);
      expect(media.isImageMedia()).toStrictEqual(true);
      expect(media.isSubtitleMedia()).toStrictEqual(false);
    });

    it('字幕', async () => {
      const media = await mediaService.readMediaByFilepath(localSubtitleFilepath);
      expect(media.isVideoMedia()).toStrictEqual(false);
      expect(media.isAudioMedia()).toStrictEqual(false);
      expect(media.isImageMedia()).toStrictEqual(false);
      expect(media.isSubtitleMedia()).toStrictEqual(true);
    });
  });

  describe('getDuration()', () => {
    it('视频(容器级时长6.334秒)', async () => {
      const media = await mediaService.readMediaByFilepath(localVideoFilepath);
      expect(media.getDuration()).toStrictEqual(6.334);
    });

    it('音频(流级时长10.584秒)', async () => {
      const media = await mediaService.readMediaByFilepath(localAudioFilepath);
      expect(media.getDuration()).toStrictEqual(10.584);
    });

    it('图片(无时长)', async () => {
      const media = await mediaService.readMediaByFilepath(localImageFilepath);
      expect(media.getDuration()).toStrictEqual(undefined);
    });
  });
});
