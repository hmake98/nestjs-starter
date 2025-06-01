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
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';

import { MessageService } from 'src/common/message/services/message.service';

import { IApiErrorResponse } from '../interfaces/response.interface';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ResponseExceptionFilter.name);
    private readonly isDebug: boolean;

    constructor(
        private readonly messageService: MessageService,
        private readonly configService: ConfigService
    ) {
        this.isDebug = this.configService.get<boolean>('app.debug');
        this.initializeSentry();
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const lang = request.headers['accept-language'] || 'en';

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'Internal server error.';
        let validationMessages: string[] | undefined;

        if (exception instanceof BadRequestException) {
            const exceptionResponse = exception.getResponse() as any;
            const exceptionMessage = exceptionResponse.message || message;

            if (Array.isArray(exceptionMessage)) {
                validationMessages =
                    this.messageService.translateValidationMessages(
                        exceptionMessage,
                        lang
                    );
                message = this.messageService.translateError(statusCode, lang);
            } else {
                message = this.messageService.translate(exceptionMessage, {
                    lang,
                    defaultValue: exceptionMessage,
                });
            }
        } else if (exception instanceof HttpException) {
            message = this.messageService.translate(exception.message, {
                lang,
                defaultValue: exception.message,
            });
        } else {
            message = this.messageService.translateError(statusCode, lang);
        }

        const errorResponse: IApiErrorResponse = {
            statusCode,
            message,
            timestamp: new Date().toISOString(),
        };

        if (validationMessages) {
            errorResponse.error = validationMessages;
        } else if (this.isDebug && exception instanceof Error) {
            errorResponse.error = exception.stack;
        }

        // Log errors
        if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `${request.method} ${request.url} - ${statusCode}: ${message}`,
                exception instanceof Error ? exception.stack : undefined
            );

            // Capture in Sentry for production errors
            this.captureSentryException(exception, request, errorResponse);
        } else if (statusCode >= HttpStatus.BAD_REQUEST) {
            this.logger.warn(
                `${request.method} ${request.url} - ${statusCode}: ${message}`
            );
        }

        response.status(statusCode).json(errorResponse);
    }

    private initializeSentry(): void {
        const sentryDsn = this.configService.get<string>('sentry.dsn');
        if (sentryDsn) {
            Sentry.init({
                dsn: sentryDsn,
                environment: this.configService.get<string>('app.env'),
                tracesSampleRate: 1.0,
            });
        }
    }

    private captureSentryException(
        exception: unknown,
        request: Request,
        errorResponse: IApiErrorResponse
    ): void {
        Sentry.withScope(scope => {
            scope.setExtra('requestUrl', request.url);
            scope.setExtra('method', request.method);
            scope.setExtra('timestamp', errorResponse.timestamp);
            scope.setExtra('body', request.body);
            scope.setExtra('query', request.query);
            scope.setExtra('params', request.params);
            scope.setExtra('headers', this.sanitizeHeaders(request.headers));

            if (exception instanceof Error) {
                Sentry.captureException(exception);
            } else {
                Sentry.captureMessage(errorResponse.message);
            }
        });
    }

    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };
        delete sanitized.authorization;
        delete sanitized.cookie;
        return sanitized;
    }
}
