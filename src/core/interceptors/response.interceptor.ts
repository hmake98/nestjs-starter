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
import { I18nService } from 'nestjs-i18n';
import { GenericResponseDto } from '../dtos/response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly i18nService: I18nService,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode: number = response.statusCode;

    const responseBody = await firstValueFrom(next.handle());

    const classSerialization: ClassConstructor<any> = this.reflector.get<
      ClassConstructor<any>
    >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler());

    const data = plainToInstance(classSerialization, responseBody);

    if (classSerialization?.name === GenericResponseDto?.name) {
      const getData = data as GenericResponseDto;
      getData.message = this.i18nService.translate(data.message, {
        lang: request.headers['accept-language'] || 'en',
        defaultValue: 'Operation successful.',
      });
      return of({
        statusCode,
        timestamp: new Date().toISOString(),
        message: HTTP_STATUS_MESSAGES[statusCode],
        data: getData,
      });
    }

    return of({
      statusCode,
      timestamp: new Date().toISOString(),
      message: HTTP_STATUS_MESSAGES[statusCode],
      data,
    });
  }
}
