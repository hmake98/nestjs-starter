import { Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { PrismaService } from './services/prisma.service';
import { TaskService } from './services/task.service';
import { EmailService } from '../notification/services/email.service';
import { EmailWorker } from './workers/email.worker';

@Module({
  imports: [],
  providers: [
    EncryptionService,
    PrismaService,
    TaskService,
    EmailWorker,
    EmailService,
  ],
  controllers: [],
  exports: [PrismaService, EncryptionService],
})
export class HelperModule {}
