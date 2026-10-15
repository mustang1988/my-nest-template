import { Logger } from 'winston';
import { lastValueFrom } from 'rxjs';
import { I18nService } from 'nestjs-i18n';
import { HttpService } from '@nestjs/axios';
import { DataSource, Repository } from 'typeorm';
import { SampleEvent } from '../event/sample.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SampleEntity } from '../entity/sample.default.entity';
import { ContextService } from '../../context/service/context.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { RedisEventEmitterService } from '../../redis/service/redis-event-emitter.service';
import { InjectMySQLDataSource } from '../../mysql/decorator/inject-mysql-datasource.decorator';

/**
 * 示例服务
 */
@Injectable()
export class SampleService {
  private readonly sampleRepo: Repository<SampleEntity>;

  constructor(
    @Inject() private readonly i18n: I18nService,
    @Inject() private readonly axios: HttpService,
    @Inject() private readonly ctx: ContextService,
    @InjectLogger() private readonly logger: Logger,
    @Inject() private readonly eventEmitter: EventEmitter2,
    @Inject() private readonly redisEventEmitter: RedisEventEmitterService,
    @InjectMySQLDataSource('default') private readonly defaultDataSource: DataSource,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    this.sampleRepo = this.defaultDataSource.getRepository(SampleEntity);
  }

  async viewSampleOrThrow(id: number): Promise<SampleEntity> {
    const requestId = this.ctx.getRequestId(); // CLS上下文中获取请求ID
    this.logger.debug('[%s] 示例数据详情查询, 入参: id = %s', requestId, id);
    const foundSample = await this.sampleRepo.findOne({ where: { id } });
    if (foundSample === null) {
      this.logger.warn('[%s] 未找到指定示例数据: id = %s', requestId, id);
      throw new NotFoundException(this.i18n.t('exception.NotFoundException', { args: { entity: 'Sample' } }));
    }
    const response = await lastValueFrom(this.axios.get<unknown>('http://localhost:3000/api/healthcheck'));
    this.logger.debug('[%s] 示例数据详情查询, 外部API响应: response = %j', requestId, response.data);

    const event = new SampleEvent(this.ctx.getRequestId(), ESampleEventPattern.SAMPLE_EVENT, foundSample);
    /**
     * 触发事件委托
     */
    this.eventEmitter.emit(event.eventName, event);
    await this.redisEventEmitter.emit<ESampleEventPattern, SampleEntity>(event, { clientName: 'default' });
    return foundSample;
  }
}
