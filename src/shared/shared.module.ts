import { Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { PrismaService } from './services/prisma.service';
import { TaskService } from './services/task.service';
import { NotificationConsumer } from './workers/notification.worker';
import { EmailConsumer } from './workers/email.worker';

@Module({
  imports: [],
  providers: [
    EncryptionService,
    PrismaService,
    TaskService,
    NotificationConsumer,
    EmailConsumer,
  ],
  exports: [
    EncryptionService,
    PrismaService,
    TaskService,
    NotificationConsumer,
    EmailConsumer,
  ],
})
export class SharedModule {}
