import { EmailTemplates } from '../constants/notification.enum';

export interface EmailPayload {
  emails: string[];
  subject: string;
  template: EmailTemplates;
  data: Record<string, any>;
}
