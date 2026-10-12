import { Inject } from '@nestjs/common';
import { getMySQLDataSourceToken } from '../mysql.constant';

/**
 * 注入指定名称的MySQL数据源
 * @param name MySQL连接名称
 */
export const InjectMySQLDataSource = (name: string) => Inject(getMySQLDataSourceToken(name));
