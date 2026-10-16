import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { MySQLModule } from './mysql.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { IMySQLConfiguration } from 'src/configuration/interface/mysql-configuration.interface';

describe(basename(__filename), () => {
  it('forRootAsync()', async () => {
    const mysqlModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        MySQLModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const mysqlConfig = configService.getOrThrow<Record<string, Required<IMySQLConfiguration>>>('mysql');
            return Object.keys(mysqlConfig).map((name) => ({ name, ...mysqlConfig[name] }));
          },
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
      ],
    }).compile();
    expect(mysqlModule);
  });
});
