import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { Observable, map } from 'rxjs';

import { RESPONSE_SERIALIZATION_META_KEY } from 'src/app/app.constant';

import { ApiGenericResponseDto } from '../dtos/response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18nService: I18nService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(responseBody => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode: number = response.statusCode;
        const lang = request.headers['accept-language'] || 'en';

        const classSerialization: ClassConstructor<any> = this.reflector.get(
          RESPONSE_SERIALIZATION_META_KEY,
          context.getHandler(),
        );

        const data = classSerialization
          ? plainToInstance(classSerialization, responseBody)
          : responseBody;

        const baseResponse = {
          statusCode,
          timestamp: new Date().toISOString(),
          message: this.i18nService.translate(`http.success.${statusCode}`, {
            lang,
            defaultValue: 'Operation completed.',
          }),
          data,
        };

        if (classSerialization?.name === ApiGenericResponseDto.name) {
          data.message = this.i18nService.translate(data.message, {
            lang,
            defaultValue: 'Operation completed.',
          });
        }

        return baseResponse;
      }),
    );
  }
}
