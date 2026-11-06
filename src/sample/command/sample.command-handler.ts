import { Logger } from 'winston';
import { SampleCommand } from './sample.command';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SampleEntity } from '../entity/sample.default.entity';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { InjectRepo } from '../../mysql/decorator/inject-repo.decorator';

/**
 * 示例Command处理器
 *
 * Command处理对应写操作(创建/修改/删除数据); 处理器中也可通过EventEmitter2等发布事件委托以触发后续流程
 *
 * @see [SampleService](../service/sample.service.ts) 流程示例中的事件委托发布
 */
@CommandHandler(SampleCommand)
export class SampleCommandHandler implements ICommandHandler<SampleCommand> {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    @InjectRepo('default', SampleEntity) private readonly sampleRepo: Repository<SampleEntity>,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  async execute(command: SampleCommand): Promise<SampleEntity> {
    this.logger.debug('[%s] 示例Command处理, 入参: command = %j', command.requestId, command);
    const createdSample = this.sampleRepo.create({ name: command.name });
    const savedSample = await this.sampleRepo.save(createdSample);
    this.logger.info('[%s] 示例Command处理完成: savedSample = %j', command.requestId, savedSample);
    return savedSample;
  }
}
