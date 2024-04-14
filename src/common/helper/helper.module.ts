import { Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { PrismaService } from './services/prisma.service';
import { TaskService } from './services/task.service';

@Module({
  imports: [],
  providers: [EncryptionService, PrismaService, TaskService],
  controllers: [],
  exports: [PrismaService, EncryptionService, TaskService],
})
export class HelperModule {}
