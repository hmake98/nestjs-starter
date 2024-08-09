import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

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

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const translationKey =
      exception instanceof HttpException && exception.message
        ? exception.message
        : 'http.500';

    const message = this.i18nService.translate(translationKey, {
      lang: request.headers['accept-language'] || 'en',
    });

    const errorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Internal Server Error: ${JSON.stringify(errorResponse)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`HTTP Exception: ${JSON.stringify(errorResponse)}`);
    }

    if (this.configService.get<string>('app.debug') === 'true') {
      errorResponse['error'] =
        exception instanceof Error ? exception.stack : undefined;
    }

    response.status(statusCode).json(errorResponse);
  }
}
