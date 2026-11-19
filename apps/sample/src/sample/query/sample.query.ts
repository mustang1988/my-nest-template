import { IQuery } from '@nestjs/cqrs';

/**
 * 示例Query
 *
 * Query用于表达一个不改变系统状态的查询意图, 由[SampleQueryHandler](./sample.query-handler.ts)处理
 */
export class SampleQuery implements IQuery {
  constructor(
    /**
     * 本次请求的唯一ID
     */
    public readonly requestId: string,
    /**
     * 示例数据ID
     */
    public readonly id: number,
  ) {}
}
