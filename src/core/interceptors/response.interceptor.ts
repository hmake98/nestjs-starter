import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import { HTTP_STATUS_MESSAGES } from '../constants/core.constant';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const body = await firstValueFrom(next.handle());
    const statusCode = this.reflector.get<number>(
      '__httpCode__',
      context.getHandler(),
    );
    return {
      statusCode,
      timestamp: new Date().toISOString(),
      message: HTTP_STATUS_MESSAGES[statusCode],
      data: body,
    };
  }
}
