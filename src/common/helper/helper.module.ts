import { Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { PrismaService } from './services/prisma.service';
import { TaskService } from './services/task.service';
import { NotificationConsumer } from './workers/notification.worker';
import { WelcomeEmailConsumer } from './workers/welcome.worker';
import { EmailService } from '../notification/services/email.service';

@Module({
  imports: [],
  providers: [
    EncryptionService,
    PrismaService,
    TaskService,
    WelcomeEmailConsumer,
    NotificationConsumer,
    EmailService,
  ],
  controllers: [],
  exports: [PrismaService, EncryptionService],
})
export class HelperModule {}
