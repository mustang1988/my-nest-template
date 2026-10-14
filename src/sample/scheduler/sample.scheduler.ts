import ms from 'ms';
import { Logger } from 'winston';
import { Inject, Injectable } from '@nestjs/common';
import { ContextService } from '../../context/service/context.service';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { InjectClsContext } from '../../context/decorator/inject-cls-context.decorator';

/**
 * 示例定时/计划任务执行器
 */
@Injectable()
export class SampleScheduler {
  constructor(
    @Inject() private readonly ctx: ContextService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  /**
   * 示例计划任务
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  @InjectClsContext()
  async handleSampleCronJob(): Promise<void> {
    this.logger.info('[%s] handleSampleCronJob: instanceId = %s', this.ctx.getRequestId(), this.ctx.getInstanceId());
  }

  /**
   * 示例定时任务
   */
  @Interval(ms('15s'))
  @InjectClsContext()
  async handleIntervalJob(): Promise<void> {
    this.logger.info('[%s] handleIntervalJob: instanceId = %s', this.ctx.getRequestId(), this.ctx.getInstanceId());
  }

  /**
   * 示例服务启动后一次性任务
   */
  @Timeout(ms('5s'))
  @InjectClsContext()
  async handleTimeoutJob(): Promise<void> {
    this.logger.info('[%s] handleTimeoutJob: instanceId = %s', this.ctx.getRequestId(), this.ctx.getInstanceId());
  }
}
