import { ITranslateOptions } from './message.interface';

export interface IMessageService {
    translate(key: string, options: ITranslateOptions): string;
    translateSuccess(statusCode: number, lang?: string): string;
    translateError(statusCode: number, lang?: string): string;
    translateValidationMessages(messages: string[], lang?: string): string[];
    translateResponseMessage(message: string, lang?: string): string;
}
