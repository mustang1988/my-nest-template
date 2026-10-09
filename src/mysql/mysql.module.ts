import { Global, Module } from '@nestjs/common';
import { mysqlDataSources } from './service/typeorm-mysql-datasource.service';

/**
 * MySQL模块
 *
 * - 全局模块
 * - 基于TypeORM
 */
@Global()
@Module({
  imports: [],
  providers: [...mysqlDataSources],
  exports: [...mysqlDataSources],
})
export class MySQLModule {}
