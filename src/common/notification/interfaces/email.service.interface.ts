import { SentMessageInfo } from 'nodemailer';
import { EmailPayload } from './email.interface';

export interface IEmailService {
  sendEmail(data: EmailPayload): Promise<SentMessageInfo>;
}
