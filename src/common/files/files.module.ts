import { Module } from '@nestjs/common';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { PrismaService } from '../helper/services/prisma.service';

@Module({
  controllers: [FilesController],
  imports: [],
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
