import { Logger } from 'winston';
import { I18nService } from 'nestjs-i18n';
import { SampleQuery } from './sample.query';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SampleEntity } from '../entity/sample.default.entity';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { InjectMySQLDataSource } from '../../mysql/decorator/inject-mysql-datasource.decorator';

/**
 * 示例Query处理器
 *
 * Query处理对应读操作(查询数据), 不应产生副作用
 */
@QueryHandler(SampleQuery)
export class SampleQueryHandler implements IQueryHandler<SampleQuery> {
  private readonly sampleRepo: Repository<SampleEntity>;

  constructor(
    @InjectMySQLDataSource('default') private readonly defaultDataSource: DataSource,
    private readonly i18n: I18nService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    this.sampleRepo = this.defaultDataSource.getRepository(SampleEntity);
  }

  async execute(query: SampleQuery): Promise<SampleEntity> {
    this.logger.debug('[%s] 示例Query处理, 入参: query = %j', query.requestId, query);
    const foundSample = await this.sampleRepo.findOne({ where: { id: query.id } });
    if (foundSample === null) {
      this.logger.warn('[%s] 示例Query处理, 未找到指定示例数据: id = %s', query.requestId, query.id);
      throw new NotFoundException(this.i18n.t('exception.NotFoundException', { args: { entity: 'Sample' } }));
    }
    return foundSample;
  }
}
