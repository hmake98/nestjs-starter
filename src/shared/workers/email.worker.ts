import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Queues } from 'src/utils/constants';

@Processor(Queues.Email)
export class EmailConsumer {
  private logger = new Logger(EmailConsumer.name);
  @Process()
  async sender(job: Job<unknown>): Promise<void> {
    this.logger.log(job);
    this.logger.log('Sending email to user.');
  }
}
