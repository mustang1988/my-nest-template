import { randomUUID } from 'crypto';
import { first, get, isObject } from 'lodash';
import { ClsService, UseCls } from 'nestjs-cls';
import { applyDecorators } from '@nestjs/common';
import { CLS_INSTANCE_ID, CLS_REQUEST_ID } from '../context.constant';

/**
 * @InjectContext(name?:string) 函数装饰器
 *
 * 在函数中注入CLS上下文
 *
 * 适用于非HTTP请求的场景中需要使用CLS上下文的情形, 诸如
 * - 定时/计划任务执行函数
 * - 事件委托处理函数
 * - 队列消费函数
 *
 * 注入到上下文中的请求ID会优先读取被装饰函数入参列表中可能存在的requestId; 若入参中没有, 则以随机UUID注入
 */
export const InjectContext = (name?: string) => {
  name = name ?? 'requestId';
  return applyDecorators(
    UseCls<any[]>({
      setup: (cls: ClsService, ...args: any[] /* 被装饰函数的入参列表 */) => {
        /**
         * 提取被装饰函数入参中可能存在的requestId
         */
        const requestIdInArgs: string | undefined = first(
          args.filter((arg) => isObject(arg) && get(arg, name)) as Array<{
            requestId: string;
          }>,
        )?.requestId;
        cls.setIfUndefined(CLS_REQUEST_ID, requestIdInArgs ?? randomUUID());
        cls.setIfUndefined(CLS_INSTANCE_ID, Number(process.env.INSTANCE_ID ?? 0));
      },
    }) as MethodDecorator,
  );
};
