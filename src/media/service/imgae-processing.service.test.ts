import { faker } from '@faker-js/faker';
import { MediaModule } from '../media.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { basename, dirname, extname, join } from 'node:path';
import { MediaException } from '../exception/media.exception';
import { ImageResizeFit } from '../type/image-resize-fit.type';
import { ImageProcessingService } from './imgae-processing.service';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';
import { MediaTestUtil, TEST_VIDEOS, TEST_AUDIOS, TEST_IMAGES, TEST_SUBTITLES, TEST_NOT_MEDIAS } from '../media.module.test';

describe(basename(__filename), () => {
  let mediaModule: TestingModule;
  let imageProcessingService: ImageProcessingService;
  /**
   * 本地下载的测试资产文件路径
   */
  let localVideoFilepath: string;
  let localAudioFilepath: string;
  let localImageFilepath: string;
  let localSubtitleFilepath: string;
  let localNotMediaFilepath: string;
  /**
   * 测试输出文件列表
   */
  const testOutputFilepaths: Array<string> = [];

  beforeAll(async () => {
    mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
    imageProcessingService = mediaModule.get(ImageProcessingService);
    expect(imageProcessingService);
    mediaModule.useLogger(mediaModule.get(WINSTON_MODULE_NEST_PROVIDER));
    localVideoFilepath = await MediaTestUtil.downloadTestAsset(TEST_VIDEOS[0]);
    localAudioFilepath = await MediaTestUtil.downloadTestAsset(TEST_AUDIOS[0]);
    localImageFilepath = await MediaTestUtil.downloadTestAsset(TEST_IMAGES[0]);
    localSubtitleFilepath = await MediaTestUtil.downloadTestAsset(TEST_SUBTITLES[0]);
    localNotMediaFilepath = await MediaTestUtil.downloadTestAsset(TEST_NOT_MEDIAS[0]);
  });

  afterAll(async () => {
    /**
     * 清理本地下载的测试资产文件
     */
    await MediaTestUtil.removeLocalTestFiles(
      localVideoFilepath,
      localAudioFilepath,
      localImageFilepath,
      localSubtitleFilepath,
      localNotMediaFilepath,
      ...testOutputFilepaths, // 删除测试输出文件
    );
    await mediaModule.close();
  });

  describe('resize()', () => {
    // 原图尺寸: 896x1200
    let targetWidth = faker.number.int({ min: 400, max: 600 });
    let targetHeight = faker.number.int({ min: 298, max: 448 });
    let targetBackground = faker.color.rgb();

    it('图片输入 | 默认 fit = cover', async () => {
      const fit: ImageResizeFit | undefined = undefined;
      const outputFilepath = join(dirname(localImageFilepath), basename(localImageFilepath) + 'cover' + extname(localImageFilepath));
      const result = await imageProcessingService.resize(localImageFilepath, outputFilepath, {
        width: targetWidth,
        height: targetHeight,
        fit,
        background: targetBackground,
      });
      expect(result).toStrictEqual(outputFilepath);
      testOutputFilepaths.push(outputFilepath);
    });

    it('图片输入 | fit = contain', async () => {
      const fit: ImageResizeFit | undefined = 'contain';
      const outputFilepath = join(dirname(localImageFilepath), basename(localImageFilepath) + fit + extname(localImageFilepath));
      const result = await imageProcessingService.resize(localImageFilepath, outputFilepath, {
        width: targetWidth,
        height: targetHeight,
        fit,
        background: targetBackground,
      });
      expect(result).toStrictEqual(outputFilepath);
      testOutputFilepaths.push(outputFilepath);
    });

    it('图片输入 | fit = fill', async () => {
      const fit: ImageResizeFit | undefined = 'fill';
      const outputFilepath = join(dirname(localImageFilepath), basename(localImageFilepath) + fit + extname(localImageFilepath));
      const result = await imageProcessingService.resize(localImageFilepath, outputFilepath, {
        width: targetWidth,
        height: targetHeight,
        fit,
        background: targetBackground,
      });
      expect(result).toStrictEqual(outputFilepath);
      testOutputFilepaths.push(outputFilepath);
    });

    it('图片输入 | fit = inside', async () => {
      const fit: ImageResizeFit | undefined = 'inside';
      const outputFilepath = join(dirname(localImageFilepath), basename(localImageFilepath) + fit + extname(localImageFilepath));
      const result = await imageProcessingService.resize(localImageFilepath, outputFilepath, {
        width: targetWidth,
        height: targetHeight,
        fit,
        background: targetBackground,
      });
      expect(result).toStrictEqual(outputFilepath);
      testOutputFilepaths.push(outputFilepath);
    });

    it('图片输入 | fit = outside', async () => {
      const fit: ImageResizeFit | undefined = 'outside';
      const outputFilepath = join(dirname(localImageFilepath), basename(localImageFilepath) + fit + extname(localImageFilepath));
      const result = await imageProcessingService.resize(localImageFilepath, outputFilepath, {
        width: targetWidth,
        height: targetHeight,
        fit,
        background: targetBackground,
      });
      expect(result).toStrictEqual(outputFilepath);
      testOutputFilepaths.push(outputFilepath);
    });

    it('视频输入', async () => {
      const fit: ImageResizeFit | undefined = undefined;
      const outputFilepath = join(dirname(localVideoFilepath), basename(localVideoFilepath) + 'cover' + extname(localVideoFilepath));
      try {
        await imageProcessingService.resize(localVideoFilepath, outputFilepath, {
          width: targetWidth,
          height: targetHeight,
          fit,
          background: targetBackground,
        });
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });

    it('音频输入', async () => {
      const fit: ImageResizeFit | undefined = undefined;
      const outputFilepath = join(dirname(localAudioFilepath), basename(localAudioFilepath) + 'cover' + extname(localAudioFilepath));
      try {
        await imageProcessingService.resize(localAudioFilepath, outputFilepath, {
          width: targetWidth,
          height: targetHeight,
          fit,
          background: targetBackground,
        });
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });

    it('字幕输入', async () => {
      const fit: ImageResizeFit | undefined = undefined;
      const outputFilepath = join(dirname(localSubtitleFilepath), basename(localSubtitleFilepath) + 'cover' + extname(localSubtitleFilepath));
      try {
        await imageProcessingService.resize(localSubtitleFilepath, outputFilepath, {
          width: targetWidth,
          height: targetHeight,
          fit,
          background: targetBackground,
        });
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });

    it('非媒体输入', async () => {
      const fit: ImageResizeFit | undefined = undefined;
      const outputFilepath = join(dirname(localNotMediaFilepath), basename(localNotMediaFilepath) + 'cover' + extname(localNotMediaFilepath));
      try {
        await imageProcessingService.resize(localNotMediaFilepath, outputFilepath, {
          width: targetWidth,
          height: targetHeight,
          fit,
          background: targetBackground,
        });
      } catch (error) {
        expect(error);
        expect(error instanceof MediaException);
      }
    });
  });
});
