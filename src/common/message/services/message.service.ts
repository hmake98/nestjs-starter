import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ITranslateOptions } from '../interfaces/message.interface';

@Injectable()
export class MessageService {
    constructor(private readonly i18nService: I18nService) {}

    translate(key: string, options?: ITranslateOptions): string {
        const defaultOptions = {
            lang: 'en',
            args: {},
            defaultValue: key,
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
            args: options?.args || {},
        };

        return this.i18nService.translate(key, finalOptions) as string;
    }

    translateSuccess(statusCode: number, lang: string = 'en'): string {
        return this.translate(`http.success.${statusCode}`, {
            lang,
            defaultValue: 'Operation completed successfully.',
        });
    }

    translateError(statusCode: number, lang: string = 'en'): string {
        return this.translate(`http.error.${statusCode}`, {
            lang,
            defaultValue: 'Internal server error.',
        });
    }

    translateValidationMessages(
        messages: string[],
        lang: string = 'en'
    ): string[] {
        return messages.map(msg => {
            try {
                const [key, paramsString] = msg.split('|');
                const params = paramsString ? JSON.parse(paramsString) : {};
                return this.translate(key, { lang, args: params });
            } catch {
                return msg;
            }
        });
    }

    translateResponseMessage(message: string, lang: string = 'en'): string {
        return this.translate(message, {
            lang,
            defaultValue: 'Operation completed.',
        });
    }
}
