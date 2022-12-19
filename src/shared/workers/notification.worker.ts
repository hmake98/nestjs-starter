import { Processor } from '@nestjs/bull';

@Processor('notification')
export class NotificationConsumer {}
