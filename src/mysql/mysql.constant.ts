import { InjectionToken } from '@nestjs/common';

/**
 * 获取指定名称MySQL数据源IoC注入Token
 * @param name MySQL连接名称
 * @return MySQL数据源IoC注入Token
 */
export const getMySQLDataSourceToken = (name: string): InjectionToken => {
  return `token:mysql-datasource:${name}`;
};
