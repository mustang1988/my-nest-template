import { Logger } from 'winston';
import { I18nService } from 'nestjs-i18n';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SampleEntity } from '../entity/sample.default.entity';
import { DEFAULT_MYSQL_DATASOURCE } from '../../mysql/mysql.constant';
import { ContextService } from '../../context/service/context.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';
import { IRedisEventMessage } from '../../redis/interface/redis-event-message.interface';
import { RedisEventEmitterService } from '../../redis/service/redis-event-emitter.service';

@Injectable()
export class SampleService {
  private readonly sampleRepo: Repository<SampleEntity>;

  constructor(
    @Inject() private readonly i18n: I18nService,
    @Inject() private readonly ctx: ContextService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject() private readonly redisEventEmitter: RedisEventEmitterService,
    @Inject(DEFAULT_MYSQL_DATASOURCE) private readonly defaultDataSource: DataSource,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    this.sampleRepo = this.defaultDataSource.getRepository(SampleEntity);
  }

  async viewSampleOrThrow(id: number): Promise<SampleEntity> {
    const foundSample = await this.sampleRepo.findOne({ where: { id } });
    if (foundSample === null) {
      this.logger.warn('[%s] 未找到指定示例: id = %s', this.ctx.getRequestId(), id);
      throw new NotFoundException(this.i18n.t('exception.NotFoundException', { args: { entity: 'Sample' } }));
    }

    /**
     * 触发事件委托
     */
    const eventMessage: IRedisEventMessage<ESampleEventPattern, SampleEntity> = {
      event: ESampleEventPattern.SAMPLE_EVENT,
      payload: foundSample,
    };
    await this.redisEventEmitter.emit(eventMessage);
    return foundSample;
  }
}
