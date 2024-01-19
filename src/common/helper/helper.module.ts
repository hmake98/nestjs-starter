import { Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { PrismaService } from './services/prisma.service';
import { TaskService } from './services/task.service';
import { EmailConsumer } from './workers/email.worker';
import { NotificationConsumer } from './workers/notification.worker';

@Module({
  imports: [],
  providers: [
    EncryptionService,
    PrismaService,
    TaskService,
    EmailConsumer,
    NotificationConsumer,
  ],
  controllers: [],
  exports: [PrismaService, EncryptionService],
})
export class HelperModule {}
