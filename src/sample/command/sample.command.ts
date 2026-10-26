import { ICommand } from '@nestjs/cqrs';

/**
 * 示例Command
 *
 * Command用于表达一个改变系统状态的动作意图, 由[SampleCommandHandler](./sample.command-handler.ts)处理
 */
export class SampleCommand implements ICommand {
  constructor(
    /**
     * 本次请求的唯一ID
     */
    public readonly requestId: string,
    /**
     * 示例数据名称
     */
    public readonly name: string,
  ) {}
}
