import { Injectable } from '@nestjs/common';
import { EmailPayload } from '../interfaces/email.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmailService } from '../interfaces/email.service.interface';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({
    emails,
    subject,
    template,
    data,
  }: EmailPayload): Promise<any> {
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
