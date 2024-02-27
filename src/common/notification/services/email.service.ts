import { Injectable } from '@nestjs/common';
import {
  EmailPayload,
  IEmailService,
} from '../interfaces/mailer.service.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ emails, subject, template, data }: EmailPayload) {
    try {
      const response = await this.mailerService.sendMail({
        to: emails,
        subject,
        template,
        context: data,
      });
      return response;
    } catch (e) {
      throw e;
    }
  }
}
