import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

import { IApiErrorResponse } from '../interfaces/response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const lang = request.headers['accept-language'] || 'en';

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'An unexpected error occurred.';
    let validationMessages: string[] | undefined;

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;
      const exceptionMessage = exceptionResponse.message || message;

      if (Array.isArray(exceptionMessage)) {
        validationMessages = exceptionMessage.map(msg => {
          const [key, paramsString] = msg.split('|');
          const params = paramsString ? JSON.parse(paramsString) : {};
          return this.i18nService.translate(key, { lang, args: params }) as string;
        });
        message = this.i18nService.translate(`http.errors.${statusCode}`, {
          lang,
          defaultValue: message,
        }) as string;
      } else {
        message = this.i18nService.translate(exceptionMessage, {
          lang,
          defaultValue: exceptionMessage,
        }) as string;
      }
    } else if (exception instanceof HttpException) {
      message = this.i18nService.translate(exception.message, {
        lang,
        defaultValue: exception.message,
      }) as string;
    } else {
      message = this.i18nService.translate(`http.errors.${statusCode}`, {
        lang,
        defaultValue: message,
      }) as string;
    }

    const errorResponse: IApiErrorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    if (validationMessages) {
      errorResponse.error = validationMessages;
    } else if (this.configService.get<string>('app.debug') === 'true') {
      errorResponse.error = exception instanceof Error ? exception.stack : undefined;
    }

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Internal Server Error: ${JSON.stringify(errorResponse)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`HTTP Exception: ${JSON.stringify(errorResponse)}`);
    }

    response.status(statusCode).json(errorResponse);
  }
}
