import { ENUM_EMAIL_TEMPLATES } from 'src/app/app.constant';

export interface ISendEmailParams {
  emailType: ENUM_EMAIL_TEMPLATES;
  emails: string[];
  payload: Record<string, any>;
}

export interface ISendEmailBasePayload<T> {
  data: T;
  toEmails: string[];
}

export interface IWelcomeEmailDataPaylaod {
  userName: string;
}
