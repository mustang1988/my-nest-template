import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { CASDOOR_SDK_TOKEN } from './casdoor.constant';
import { SDK as CasdoorSDK } from 'casdoor-nodejs-sdk';
import { ICasdoorConfiguration } from 'src/configuration/interface/casdoor-configuration.interface';

@Global()
@Module({
  providers: [
    // #region casdoor sdk 实例
    {
      provide: CASDOOR_SDK_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CasdoorSDK => {
        const casdoorConf = configService.getOrThrow<Required<ICasdoorConfiguration>>('casdoor');
        const timeout = configService.getOrThrow<number>('constants.axios.timeout');
        return new CasdoorSDK(casdoorConf, { timeout });
      },
    },
    // #endregion
  ],
  exports: [],
})
export class CasdoorModule {}
