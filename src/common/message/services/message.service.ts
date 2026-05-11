import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { ITranslateOptions } from '../interfaces/message.interface';

@Injectable()
export class MessageService {
    private readonly fallbackLanguage = 'en';

    constructor(private readonly i18nService: I18nService) {}

    translate(key: string, options?: ITranslateOptions): string {
        const lang = options?.lang ?? this.getCurrentLanguage();
        return this.i18nService.translate(key, {
            lang,
            args: options?.args ?? {},
            defaultValue: options?.defaultValue ?? key,
        });
    }

    translateKey(
        parts: (string | number)[],
        options?: ITranslateOptions
    ): string {
        return this.translate(parts.join('.'), options);
    }

    translateHttpStatus(
        statusCode: number,
        type: 'error' | 'success',
        defaultValue: string
    ): string {
        return this.translateKey(['http', type, statusCode], { defaultValue });
    }

    resolveSuccessMessage(
        messageKey: string | undefined,
        statusCode: number
    ): string {
        if (messageKey) {
            return this.translate(messageKey);
        }
        return this.translateHttpStatus(statusCode, 'success', 'Success');
    }

    resolveExceptionMessage(
        exception: unknown,
        statusCode: number
    ): { message: string; validationMessages?: string[] } {
        if (exception instanceof BadRequestException) {
            const body = exception.getResponse() as {
                message?: string | string[];
            };

            if (Array.isArray(body.message)) {
                return {
                    message: this.translateHttpStatus(
                        statusCode,
                        'error',
                        'Bad Request'
                    ),
                    validationMessages: this.translateValidationMessages(
                        body.message
                    ),
                };
            }

            return {
                message: this.translate(body.message ?? 'http.error.400', {
                    defaultValue: body.message ?? 'Bad Request',
                }),
            };
        }

        if (exception instanceof HttpException) {
            return {
                message: this.translate(exception.message, {
                    defaultValue: exception.message,
                }),
            };
        }

        return {
            message: this.translateHttpStatus(
                statusCode,
                'error',
                'Internal Server Error'
            ),
        };
    }

    translateValidationMessages(messages: string[]): string[] {
        return messages.map(msg => {
            try {
                const [key, paramsString] = msg.split('|');
                const args = paramsString ? JSON.parse(paramsString) : {};
                return this.translate(key, { args });
            } catch {
                return this.translate(msg, { defaultValue: msg });
            }
        });
    }

    private getCurrentLanguage(): string {
        try {
            return I18nContext.current()?.lang ?? this.fallbackLanguage;
        } catch {
            return this.fallbackLanguage;
        }
    }
}
