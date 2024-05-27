import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EncryptionService } from './services/encryption.service';
import { PrismaService } from './services/prisma.service';
import { TaskService } from './services/task.service';

@Module({
  imports: [],
  providers: [JwtService, EncryptionService, PrismaService, TaskService],
  controllers: [],
  exports: [EncryptionService, PrismaService, TaskService],
})
export class HelperModule {}
