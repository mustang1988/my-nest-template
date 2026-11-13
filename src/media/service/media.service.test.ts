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

  describe('readMediaByFilepath()', () => {
    it('视频文件', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\视频文件\\HDR\\Sony Swordsmith HDR UHD 4K Demo.mp4';
      const result = mediaService.readMediaByFilepath(filepath);
      expect(result);
      // console.log('视频文件: %s\n%o', filepath, result);
    });

    it('音频文件', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\音频文件\\音乐\\明日への鼓動.opus';
      const result = mediaService.readMediaByFilepath(filepath);
      expect(result);
      // console.log('音频文件: %s\n%o', filepath, result);
    });

    it('图片文件', () => {
      const filepath = 'D:\\WorkFiles\\测试用资产\\图片文件\\人物\\human_1.png';
      const result = mediaService.readMediaByFilepath(filepath);
      expect(result);
      // console.log('图片文件: %s\n%o', filepath, result);
    });

    it('文件不存在', () => {
      try {
        const filepath = `C:\\${randomUUID()}`;
        mediaService.readMediaByFilepath(filepath);
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });
  });

  describe('readMediaByUrl()', () => {
    it('视频文件', () => {
      const url = 'http://10.50.2.35:9001/test/1518ccdd-c83c-4f6c-a0e2-6f5e4cff06f5.mp4';
      const result = mediaService.readMediaByUrl(url);
      expect(result);
      // console.log('视频文件: %s\n%o', url, result);
    });

    it('音频文件', () => {
      const url = 'http://10.50.2.35:9001/test/r2v_tea_audio1.mp3';
      const result = mediaService.readMediaByUrl(url);
      expect(result);
      // console.log('音频文件: %s\n%o', url, result);
    });

    it('图片文件', () => {
      const url = 'http://10.50.2.35:9001/test/061209205678761009.png';
      const result = mediaService.readMediaByUrl(url);
      expect(result);
      // console.log('图片文件: %s\n%o', url, result);
    });

    it('URL无法访问', () => {
      try {
        const url = faker.internet.url();
        mediaService.readMediaByUrl(url);
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });

    it('URL格式无效', () => {
      try {
        const url = randomUUID();
        mediaService.readMediaByUrl(url);
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });
  });
});
