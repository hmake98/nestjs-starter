export interface IAwsSNSService {
  sendSms(phoneNumber: string, message: string): Promise<string>;
}
