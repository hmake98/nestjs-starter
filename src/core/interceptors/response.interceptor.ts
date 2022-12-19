import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { statusMessages } from '../../utils/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const body = await firstValueFrom(next.handle());
    const request = context.switchToHttp().getRequest<Request>();
    const status =
      this.reflector.get<number>('__httpCode__', context.getHandler()) ||
      (request.method === 'POST' ? 201 : 200);
    return of({
      statusCode: status,
      message: statusMessages[status],
      data: body,
    });
  }
}
