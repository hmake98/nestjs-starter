export interface ITranslateOptions {
    /** Override language. Defaults to the current request context, falling back to "en". */
    lang?: string;
    /** Arguments to interpolate into the translation string. */
    args?: Record<string, unknown>;
    /** Value to return when the translation key is missing. Defaults to the key itself. */
    defaultValue?: string;
}

export interface ITranslateItem {
    key: string;
    args?: Record<string, unknown>;
    defaultValue?: string;
}
