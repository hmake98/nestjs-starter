import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Queues } from 'src/utils/util';
import { EmailService } from '../services';

@Processor(Queues.email)
export class EmailConsumer {
  private logger = new Logger(EmailConsumer.name);

  constructor(private readonly emailService: EmailService) {
    //
  }

  @Process()
  async sender(job: Job<unknown>): Promise<void> {
    this.logger.log(job);
    this.logger.log('Sending email to user.');
    // this.emailService.sendEmail();
  }
}
