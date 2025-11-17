/**
 * Translation options for the message service
 */
export interface ITranslateOptions {
    /**
     * Language code (e.g., 'en', 'es', 'fr')
     * If not provided, will use the language from the current request context
     */
    lang?: string;

    /**
     * Arguments to interpolate into the translation
     * These will replace placeholders in the translation string
     */
    args?: Record<string, any>;

    /**
     * Default value to return if translation key is not found
     * If not provided, will use the key itself as the default
     */
    defaultValue?: string;
}

/**
 * Bulk translation item
 */
export interface ITranslateItem {
    /**
     * Translation key
     */
    key: string;

    /**
     * Arguments to interpolate
     */
    args?: Record<string, any>;

    /**
     * Default value for this specific translation
     */
    defaultValue?: string;
}

/**
 * Common translation key patterns used throughout the application
 */
export enum TranslationKey {
    // HTTP Status Messages
    HTTP_SUCCESS = 'http.success',
    HTTP_ERROR = 'http.error',

    // Auth Messages
    AUTH_ERROR = 'auth.error',

    // Validation Messages
    VALIDATION_ERROR = 'validation',

    // Generic Messages
    OPERATION_SUCCESS = 'common.operationSuccess',
    OPERATION_FAILED = 'common.operationFailed',
}
