import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { MessageService } from 'src/common/message/services/message.service';

import { IApiErrorResponse } from '../interfaces/response.interface';
import { SentryService } from '../services/response.sentry.service';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ResponseExceptionFilter.name);
    private readonly isDebug: boolean;

    constructor(
        private readonly messageService: MessageService,
        private readonly sentryService: SentryService,
        configService: ConfigService
    ) {
        this.isDebug = configService.get<boolean>('app.debug') ?? false;
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const { message, validationMessages } =
            this.messageService.resolveExceptionMessage(exception, statusCode);

        const errorResponse: IApiErrorResponse = {
            statusCode,
            message,
            timestamp: new Date().toISOString(),
        };

        if (this.isDebug) {
            if (validationMessages) {
                errorResponse.error = validationMessages;
            } else if (exception instanceof Error) {
                errorResponse.error = exception.stack;
            }
        }

        if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `${request.method} ${request.url} - ${statusCode}: ${message}`,
                exception instanceof Error ? exception.stack : undefined
            );
            this.sentryService.capture(exception, request);
        }

        response.status(statusCode).json(errorResponse);
    }
}
