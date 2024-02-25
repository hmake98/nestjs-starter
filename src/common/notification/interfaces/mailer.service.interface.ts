import { SentMessageInfo } from 'nodemailer';

export interface IEmailService {
  sendEmail(data: EmailPayload): Promise<SentMessageInfo>;
}

export enum EmailTemplates {
  Welcome = 'welcome',
}

export interface EmailPayload {
  emails: string[];
  subject: string;
  template: EmailTemplates;
  data: object;
}
