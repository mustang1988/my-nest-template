import { InjectionToken } from '@nestjs/common';

/**
 * MySQL模块配置选项IoC注入Token
 *
 * 注入的Provider泛型为: Array<IMySQLDataSourceOptions>
 */
export const MYSQL_DATASOURCE_OPTIONS_TOKEN: symbol = Symbol('token:mysql-datasource-options');

/**
 * MySQL数据源Map IoC注入Token
 *
 * 注入的Provider泛型为: Map<string, DataSource>
 */
export const MYSQL_DATASOURCE_MAP_TOKEN: symbol = Symbol('token:mysql-datasource-map');

/**
 * 获取指定名称MySQL数据源IoC注入Token
 * @param name MySQL连接名称
 * @return MySQL数据源IoC注入Token
 */
export const getMySQLDataSourceToken = (name: string): InjectionToken => `token:mysql-datasource:${name}`;
