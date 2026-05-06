import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
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

        const { message, validationMessages } = this.resolveMessage(
            exception,
            statusCode
        );

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
            this.captureSentry(exception, request);
        } else if (statusCode >= HttpStatus.BAD_REQUEST) {
            this.logger.warn(
                `${request.method} ${request.url} - ${statusCode}: ${message}`
            );
        }

        response.status(statusCode).json(errorResponse);
    }

    private resolveMessage(
        exception: unknown,
        statusCode: number
    ): { message: string; validationMessages?: string[] } {
        if (exception instanceof BadRequestException) {
            const exceptionResponse = exception.getResponse() as {
                message?: string | string[];
            };
            const exceptionMessage = exceptionResponse.message;

            if (Array.isArray(exceptionMessage)) {
                return {
                    message: this.messageService.translateKey(
                        ['http', 'error', statusCode],
                        { defaultValue: 'Bad Request' }
                    ),
                    validationMessages:
                        this.translateValidationMessages(exceptionMessage),
                };
            }

            return {
                message: this.messageService.translate(
                    exceptionMessage ?? 'http.error.400',
                    { defaultValue: exceptionMessage ?? 'Bad Request' }
                ),
            };
        }

        if (exception instanceof HttpException) {
            return {
                message: this.messageService.translate(exception.message, {
                    defaultValue: exception.message,
                }),
            };
        }

        return {
            message: this.messageService.translateKey(
                ['http', 'error', statusCode],
                { defaultValue: 'Internal Server Error' }
            ),
        };
    }

    private translateValidationMessages(messages: string[]): string[] {
        return messages.map(msg => {
            try {
                const [key, paramsString] = msg.split('|');
                const args = paramsString ? JSON.parse(paramsString) : {};
                return this.messageService.translate(key, { args });
            } catch {
                return this.messageService.translate(msg, {
                    defaultValue: msg,
                });
            }
        });
    }

    private captureSentry(exception: unknown, request: Request): void {
        if (!Sentry.getClient()) return;

        Sentry.withScope(scope => {
            scope.setExtra('requestUrl', request.url);
            scope.setExtra('method', request.method);
            scope.setExtra('body', request.body);
            scope.setExtra('query', request.query);
            scope.setExtra('params', request.params);
            scope.setExtra('headers', this.sanitizeHeaders(request.headers));

            if (exception instanceof Error) {
                Sentry.captureException(exception);
            } else {
                Sentry.captureMessage('Non-Error exception thrown');
            }
        });
    }

    private sanitizeHeaders(
        headers: Record<string, unknown>
    ): Record<string, unknown> {
        const sanitized = { ...headers };
        delete sanitized.authorization;
        delete sanitized.cookie;
        return sanitized;
    }
}
