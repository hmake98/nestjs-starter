import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly i18nService: I18nService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const translationKey =
      exception instanceof HttpException && exception.message
        ? `translations.${exception.message}`
        : 'translations.defaultErrorMessage';

    const message = this.i18nService.translate(translationKey, {
      lang: request.headers['accept-language'] || 'en',
    });

    const errorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      const errorDetails = {
        ...errorResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
      };
      this.logger.error(JSON.stringify(errorDetails));
    } else {
      this.logger.error(JSON.stringify(errorResponse));
    }

    response.status(statusCode).json(errorResponse);
  }
}
