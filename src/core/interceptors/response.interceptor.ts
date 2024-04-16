import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { HTTP_STATUS_MESSAGES } from '../constants/core.constant';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const body = await firstValueFrom(next.handle());

    const ctx: HttpArgumentsHost = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode: number = response.statusCode;

    return of({
      statusCode,
      timestamp: new Date().toISOString(),
      message: HTTP_STATUS_MESSAGES[statusCode],
      data: body,
    });
  }
}
