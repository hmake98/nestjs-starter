import { Module } from '@nestjs/common';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { HelperModule } from '../helper/helper.module';

@Module({
  controllers: [FilesController],
  imports: [HelperModule],
  providers: [FilesService],
})
export class FilesModule {}
