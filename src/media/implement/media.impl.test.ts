import { basename } from 'node:path';
import { ClsService } from 'nestjs-cls';
import { MediaModule } from '../media.module';
import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from '../service/media.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

describe(basename(__filename), () => {
  let mediaModule: TestingModule;
  let mediaService: MediaService;
  let cls: ClsService;

  beforeAll(async () => {
    mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
    cls = mediaModule.get(ClsService);
    expect(cls);
    mediaService = mediaModule.get(MediaService);
    expect(mediaService);
  });

  describe('getVideoStreams()', () => {
    it('视频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const videoStreams = media.getVideoStreams();
      expect(videoStreams).not.toStrictEqual([]);
    });

    it('图片', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const videoStreams = media.getVideoStreams();
      expect(videoStreams).not.toStrictEqual([]);
    });

    it('音频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const videoStreams = media.getVideoStreams();
      expect(videoStreams).toStrictEqual([]);
    });
  });

  describe('getVideoStream(index)', () => {
    it('视频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const videoStream = media.getVideoStream(0);
      expect(videoStream).not.toStrictEqual(undefined);
    });

    it('图片', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const videoStream = media.getVideoStream(0);
      expect(videoStream).not.toStrictEqual(undefined);
    });

    it('音频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const videoStream = media.getVideoStream(0);
      expect(videoStream).toStrictEqual(undefined);
    });
  });

  describe('getAudioStreams()', () => {
    it('视频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const audioStreams = media.getAudioStreams();
      expect(audioStreams).not.toStrictEqual([]);
    });

    it('图片', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const audioStreams = media.getAudioStreams();
      expect(audioStreams).toStrictEqual([]);
    });

    it('音频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const audioStreams = media.getAudioStreams();
      expect(audioStreams).not.toStrictEqual([]);
    });
  });

  describe('getAudioStream(index)', () => {
    it('视频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const audioStream = media.getAudioStream(0);
      expect(audioStream).not.toStrictEqual(undefined);
    });

    it('图片', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const audioStream = media.getAudioStream(0);
      expect(audioStream).toStrictEqual(undefined);
    });

    it('音频', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus';
      const media = mediaService.readMediaByFilepath(filepath);
      expect(media);
      const audioStream = media.getAudioStream(0);
      expect(audioStream).not.toStrictEqual(undefined);
    });
  });
});
