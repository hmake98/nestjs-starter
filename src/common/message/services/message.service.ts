import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import {
    ITranslateItem,
    ITranslateOptions,
} from '../interfaces/message.interface';

/**
 * MessageService - Central service for handling all i18n translations
 *
 * This service provides a streamlined API for translating messages throughout the application.
 * It automatically handles language resolution from the request context and provides
 * type-safe translation methods.
 *
 * @example
 * // Simple translation
 * const message = messageService.translate('user.created');
 *
 * @example
 * // Translation with arguments
 * const message = messageService.translate('user.welcome', {
 *   args: { name: 'John' }
 * });
 *
 * @example
 * // Translation with specific language
 * const message = messageService.translate('user.created', {
 *   lang: 'es'
 * });
 *
 * @example
 * // Bulk translations
 * const messages = messageService.translateBulk([
 *   { key: 'user.created' },
 *   { key: 'user.updated', args: { name: 'John' } }
 * ]);
 */
@Injectable()
export class MessageService {
    private readonly fallbackLanguage = 'en';

    constructor(private readonly i18nService: I18nService) {}

    /**
     * Translate a single message key
     *
     * @param key - Translation key (e.g., 'user.created', 'http.error.404')
     * @param options - Translation options (language, arguments, default value)
     * @returns Translated message
     */
    translate(key: string, options?: ITranslateOptions): string {
        const lang = this.resolveLanguage(options?.lang);
        const args = options?.args || {};
        const defaultValue = options?.defaultValue || key;

        const translationOptions = {
            lang,
            args,
            defaultValue,
        };

        return this.i18nService.translate(key, translationOptions) as string;
    }

    /**
     * Translate multiple messages in a single call
     * More efficient than calling translate() multiple times
     *
     * @param items - Array of translation items
     * @param lang - Optional language override for all items
     * @returns Array of translated messages in the same order
     *
     * @example
     * const messages = messageService.translateBulk([
     *   { key: 'user.created' },
     *   { key: 'user.updated', args: { name: 'John' } },
     *   { key: 'user.deleted', defaultValue: 'User removed' }
     * ], 'es');
     */
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

    /**
     * Build and translate a key with dynamic parts
     * Useful for structured translation keys like 'http.error.404'
     *
     * @param parts - Array of key parts to join with dots
     * @param options - Translation options
     * @returns Translated message
     *
     * @example
     * // Translates 'http.error.404'
     * const message = messageService.translateKey(['http', 'error', '404']);
     *
     * @example
     * // Translates 'auth.error.invalidPassword'
     * const message = messageService.translateKey(
     *   ['auth', 'error', 'invalidPassword'],
     *   { args: { attempts: 3 } }
     * );
     */
    translateKey(
        parts: (string | number)[],
        options?: ITranslateOptions
    ): string {
        const key = parts.join('.');
        return this.translate(key, options);
    }

    /**
     * Get the current language from the i18n context
     * Falls back to default language if context is not available
     *
     * @returns Current language code
     */
    getCurrentLanguage(): string {
        try {
            const i18nContext = I18nContext.current();
            return i18nContext?.lang || this.fallbackLanguage;
        } catch {
            return this.fallbackLanguage;
        }
    }

    /**
     * Resolve language from provided value or context
     * Priority: provided lang > context lang > fallback lang
     *
     * @param lang - Optional language override
     * @returns Resolved language code
     */
    private resolveLanguage(lang?: string): string {
        if (lang) {
            return lang;
        }

        return this.getCurrentLanguage();
    }
}
