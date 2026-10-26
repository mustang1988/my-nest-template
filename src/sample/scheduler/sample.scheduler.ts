import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { ContextService } from '../../context/service/context.service';
import { AutoContextLogger } from '../../logger/auto-context-logger';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { InjectContext } from '../../context/decorator/inject-context.decorator';

/**
 * 示例定时/计划任务执行器
 */
@Injectable()
export class SampleScheduler extends AutoContextLogger {
  constructor(private readonly ctx: ContextService) {
    super();
  }

  /**
   * 示例计划任务
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  @InjectContext()
  async handleSampleCronJob(): Promise<void> {
    this.logger.info('[%s] handleSampleCronJob: instanceId = %s', this.ctx.getRequestId(), this.ctx.getInstanceId());
  }

  /**
   * 示例定时任务
   */
  @Interval(ms('15s'))
  @InjectContext()
  async handleIntervalJob(): Promise<void> {
    this.logger.info('[%s] handleIntervalJob: instanceId = %s', this.ctx.getRequestId(), this.ctx.getInstanceId());
  }

  /**
   * 示例服务启动后一次性任务
   */
  @Timeout(ms('5s'))
  @InjectContext()
  async handleTimeoutJob(): Promise<void> {
    this.logger.info('[%s] handleTimeoutJob: instanceId = %s', this.ctx.getRequestId(), this.ctx.getInstanceId());
  }
}
