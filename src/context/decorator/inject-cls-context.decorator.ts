import { randomUUID } from 'crypto';
import { get, isObject } from 'lodash';
import { ClsService, UseCls } from 'nestjs-cls';
import { applyDecorators } from '@nestjs/common';
import { CLS_INSTANCE_ID, CLS_REQUEST_ID } from '../../common/common.constant';

/**
 * 注入CLS上下文
 *
 * 用于非HTTP请求的场景中需要使用CLS上下文, 诸如
 * - 定时/计划任务
 * - 事件委托
 */
export const InjectClsContext = () => {
  return applyDecorators(
    UseCls<unknown[]>({
      setup: (cls: ClsService, ...args: unknown[] /* 被装饰函数的入参列表 */) => {
        const requestIdInArg: Array<{ requestId: string }> = args.filter((arg) => isObject(arg) && get(arg, 'requestId')) as Array<{
          requestId: string;
        }>;
        cls.setIfUndefined(CLS_REQUEST_ID, requestIdInArg[0]?.requestId ?? randomUUID());
        cls.setIfUndefined(CLS_INSTANCE_ID, Number(process.env.INSTANCE_ID ?? 0));
      },
    }) as MethodDecorator,
  );
};
