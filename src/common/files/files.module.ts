import { Module } from '@nestjs/common';

import { HelperModule } from '../helper/helper.module';

import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';

@Module({
  controllers: [FilesController],
  imports: [HelperModule],
  providers: [FilesService],
})
export class FilesModule {}
