import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { QueueConsumerService, QueueProducerService } from './bull.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  providers: [QueueProducerService, QueueConsumerService],
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('bull').host,
          port: configService.get('bull').port,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: process.env.QUEUE_NAME,
    }),
  ],
  exports: [BullModule, QueueConsumerService, QueueProducerService],
})
export class QueueModule {}
