import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Queues } from 'src/app/app.constant';

@Processor(Queues.Notification)
export class NotificationConsumer {
  private logger = new Logger(NotificationConsumer.name);
  @Process()
  async sender(job: Job<unknown>): Promise<void> {
    this.logger.log(job);
    this.logger.log('Sending notification to user.');
  }
}
