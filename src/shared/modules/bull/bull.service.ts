import { InjectQueue, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue, Job } from 'bull';

@Injectable()
export class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name);

  constructor(@InjectQueue('demo') private readonly queue: Queue) {}

  public async addToQueue(message: string): Promise<string> {
    try {
      await this.queue.add('messages', {
        text: message,
      });
      return 'done';
    } catch (e) {
      this.logger.error(e);
    }
  }
}

@Processor(process.env.QUEUE_NAME)
export class QueueConsumerService {
  private readonly logger = new Logger(QueueConsumerService.name);

  @Process('messages')
  public async messages(job: Job): Promise<boolean> {
    try {
      console.log(job.data);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error(error);
  }
}
