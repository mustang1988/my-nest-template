import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatetimeValueTransformer } from '../../mysql/value-transformer/datetime.value-transformer';

/**
 * 示例实体
 *
 * DDL
 * ```sql
 * CREATE TABLE `tb_sample` (
 *   `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
 *   `name` varchar(100) NOT NULL,
 *   `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
 *   PRIMARY KEY (`id`)
 * ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='示例';
 * ```
 */
@Entity({ name: 'tb_sample', comment: '示例' })
export class SampleEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', comment: '自增主键' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, comment: '' })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', transformer: new DatetimeValueTransformer(), comment: '创建时间' })
  createdAt: Date;
}
