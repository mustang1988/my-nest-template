import ms from 'ms';
import { Logger } from 'winston';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

/**
 * 示例定时/计划任务执行器
 */
@Injectable()
export class SampleScheduler {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  /**
   * 示例计划任务
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleSampleCronJob(): void {
    this.logger.info('handleSampleCronJob');
  }

  /**
   * 示例定时任务
   */
  @Interval(ms('15s'))
  handleIntervalJob(): void {
    this.logger.info('handleIntervalJob');
  }

  /**
   * 示例服务启动后一次性任务
   */
  @Timeout(ms('5s'))
  handleTimeoutJob(): void {
    this.logger.info('handleTimeoutJob');
  }
}
