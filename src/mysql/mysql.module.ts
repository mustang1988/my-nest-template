import { Global, Module } from '@nestjs/common';
import { mysqlDataSources } from './service/typeorm-mysql-datasource.service';

@Global()
@Module({
  imports: [],
  providers: [...mysqlDataSources],
  exports: [...mysqlDataSources],
})
export class MySQLModule {}
