import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import {
    ITranslateItem,
    ITranslateOptions,
} from '../interfaces/message.interface';

@Injectable()
export class MessageService {
    private readonly fallbackLanguage = 'en';

    constructor(private readonly i18nService: I18nService) {}

    translate(key: string, options?: ITranslateOptions): string {
        return this.i18nService.translate(key, {
            lang: this.resolveLanguage(options?.lang),
            args: options?.args ?? {},
            defaultValue: options?.defaultValue ?? key,
        });
    }

    translateBulk(items: ITranslateItem[], lang?: string): string[] {
        const resolvedLang = this.resolveLanguage(lang);
        return items.map(item =>
            this.translate(item.key, {
                lang: resolvedLang,
                args: item.args,
                defaultValue: item.defaultValue,
            })
        );
    }

    translateKey(
        parts: (string | number)[],
        options?: ITranslateOptions
    ): string {
        return this.translate(parts.join('.'), options);
    }

    getCurrentLanguage(): string {
        try {
            return I18nContext.current()?.lang ?? this.fallbackLanguage;
        } catch {
            return this.fallbackLanguage;
        }
    }

    private resolveLanguage(lang?: string): string {
        return lang ?? this.getCurrentLanguage();
    }
}
