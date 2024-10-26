import { Module } from '@nestjs/common';

import { HelperModule } from '../helper/helper.module';

import { FilePublicController } from './controllers/files.controller';
import { FileService } from './services/files.service';

@Module({
    controllers: [FilePublicController],
    imports: [HelperModule],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}
