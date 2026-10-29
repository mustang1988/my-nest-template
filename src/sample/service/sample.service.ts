import { Logger } from 'winston';
import { lastValueFrom } from 'rxjs';
import { I18nService } from 'nestjs-i18n';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { SampleEvent } from '../event/sample.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SampleEntity } from '../entity/sample.default.entity';
import { ContextService } from '../../context/service/context.service';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { RedisEventEmitterService } from '../../redis/service/redis-event-emitter.service';
import { InjectRepo } from '../../mysql/decorator/inject-repo.decorator';

/**
 * 示例服务
 */
@Injectable()
export class SampleService {
  constructor(
    private readonly i18n: I18nService,
    private readonly axios: HttpService,
    private readonly ctx: ContextService,
    private readonly eventEmitter: EventEmitter2,
    @InjectLogger() private readonly logger: Logger,
    private readonly redisEventEmitter: RedisEventEmitterService,
    @InjectRepo('default', SampleEntity) private readonly sampleRepo: Repository<SampleEntity>,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  async viewSampleOrThrow(id: number): Promise<SampleEntity> {
    const requestId = this.ctx.getRequestId(); // CLS上下文中获取请求ID
    const executionContext: ExecutionContext = this.ctx.getExecutionContext(); // CLS上下文中获取当前请求的ExecutionContext
    this.logger.debug(
      '[%s] 示例数据详情查询, 入参: id = %s, controller = %s, action = %s',
      requestId,
      id,
      executionContext.getClass().name, // Controller类名
      executionContext.getHandler().name, // Action函数名
    );
    const foundSample = await this.sampleRepo.findOne({ where: { id } });
    if (foundSample === null) {
      this.logger.warn('[%s] 未找到指定示例数据: id = %s', requestId, id);
      throw new NotFoundException(this.i18n.t('exception.NotFoundException', { args: { entity: 'Sample' } }));
    }

    const url = 'http://localhost:3000/api/healthcheck';
    try {
      const response = await lastValueFrom(this.axios.get<unknown>(url));
      this.logger.debug('[%s] 示例数据详情查询, 外部API响应: response = %j', requestId, response.data);
    } catch (error) {
      this.logger.error('[%s] 外部接口请求失败: url = %s, error = %o', requestId, url, error);
    }

    const event = new SampleEvent(this.ctx.getRequestId(), ESampleEventPattern.SAMPLE_EVENT, foundSample);
    /**
     * 触发事件委托
     */
    this.eventEmitter.emit(event.eventName, event);
    await this.redisEventEmitter.emit<ESampleEventPattern, SampleEntity>(event, { clientName: 'default' });
    return foundSample;
  }
}
