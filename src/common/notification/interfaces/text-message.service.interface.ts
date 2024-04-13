export interface ITextMessageService {
  sendSms(phoneNumber: string, message: string): Promise<string>;
}
