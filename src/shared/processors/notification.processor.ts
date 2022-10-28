import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notification')
export class NotificationConsumer {
  @Process()
  async sendNotification(job: Job<unknown>) {}
}
