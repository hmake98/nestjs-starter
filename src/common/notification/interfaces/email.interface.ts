import { EmailTemplates } from 'src/app/app.enum';

export interface EmailPayload {
  emails: string[];
  subject: string;
  template: EmailTemplates;
  data: object;
}
