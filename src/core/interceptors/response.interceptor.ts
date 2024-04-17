import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import {
  HTTP_STATUS_MESSAGES,
  RESPONSE_SERIALIZATION_META_KEY,
} from '../constants/core.constant';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode: number = response.statusCode;

    const responseBody = await firstValueFrom(next.handle());

    const classSerialization: ClassConstructor<any> = this.reflector.get<
      ClassConstructor<any>
    >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler());

    const data = plainToInstance(classSerialization, responseBody);

    return of({
      statusCode,
      timestamp: new Date().toISOString(),
      message: HTTP_STATUS_MESSAGES[statusCode],
      data,
    });
  }
}
