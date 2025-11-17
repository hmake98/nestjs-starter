import { Module } from '@nestjs/common';

import { AwsModule } from '../aws/aws.module';
import { HelperModule } from '../helper/helper.module';

import { FilePublicController } from './controllers/files.controller';
import { FileService } from './services/files.service';

@Module({
    controllers: [FilePublicController],
    imports: [AwsModule, HelperModule],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}
