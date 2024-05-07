import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { ResponseDto } from '../dtos/response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly isDebug: string;
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {
    this.isDebug = this.configService.get('app.debug');
  }

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
        ? exception.message
        : 'errors.defaultErrorMessage';

    const message = this.i18nService.translate(translationKey, {
      lang: request.headers['accept-language'] || 'en',
    });

    const errorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    } as ResponseDto<null>;

    let errorDetails: Record<string, any>;

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorDetails = {
        ...errorResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
      };
      this.logger.error(JSON.stringify(errorDetails));
    } else {
      this.logger.error(JSON.stringify(errorResponse));
    }

    if (this.isDebug === 'true') {
      errorResponse['error'] =
        exception instanceof Error ? exception.stack : undefined;
    }

    response.status(statusCode).json(errorResponse);
  }
}
