import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Queues } from '../../../app/app.constant';
import { EmailService } from '../../../common/notification/services/email.service';
import { EmailTemplates } from 'src/common/notification/interfaces/mailer.service.interface';

@Processor(Queues.WelcomeEmail)
export class WelcomeEmailConsumer {
  private logger = new Logger(WelcomeEmailConsumer.name);
  constructor(private readonly emailService: EmailService) {}
  @Process()
  async sender(job: Job<any>): Promise<void> {
    const { firstName, lastName, email } = job.data;
    this.emailService
      .sendEmail({
        data: { firstName, lastName },
        emails: [email],
        subject: 'Welcome Email',
        template: EmailTemplates.Welcome,
      })
      .then((response) => {
        this.logger.log('welcome email sent', JSON.stringify(response));
      })
      .catch((e) => this.logger.error(e));
  }
}
