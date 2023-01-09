import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notification')
export class NotificationConsumer {
  @Process()
  async sender(job: Job<unknown>): Promise<void> {}
}
