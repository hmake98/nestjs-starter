import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const i18n = I18nContext.current(host);

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = await i18n.t(`translation.${exception.message}`);

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      const error = {
        stack: exception.stack,
        message,
        statusCode,
      };
      this.logger.error(JSON.stringify(error));
    }

    if (message?.split('.')[0] === 'translation') {
      const message = exception.message || 'Internal server error';
      response.status(statusCode).json({
        statusCode,
        message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
    return;
  }
}
