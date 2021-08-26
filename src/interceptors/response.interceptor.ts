import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { statusMessages } from 'src/common/constant';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector) {}

  public async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const body = await next.handle().toPromise();
    const request = context.switchToHttp().getRequest<Request>();
    const status =
      this.reflector.get<number>('__httpCode__', context.getHandler()) || (request.method === 'POST' ? 201 : 200);
    return of({
      statusCode: status,
      message: statusMessages[status],
      data: body,
    });
  }
}
