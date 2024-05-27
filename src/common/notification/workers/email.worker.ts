import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

import { BullQueues } from '../constants/notification.constants';
import { EmailTemplates } from '../constants/notification.enum';

@Processor(BullQueues.EMAIL_QUEUE)
export class EmailWorker {
  private logger = new Logger(EmailWorker.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process(EmailTemplates.WELCOME_EMAIL)
  async sendEmailWorker(job: Job<any>): Promise<void> {
    const { data, email } = job.data;
    this.mailerService
      .sendMail({
        to: [email],
        subject: 'welcome to the platform',
        template: EmailTemplates.WELCOME_EMAIL,
        context: data,
      })
      .then((response) => {
        this.logger.log('Welcome email sent: ', JSON.stringify(response));
      })
      .catch((e) => this.logger.error(e));
  }
}
