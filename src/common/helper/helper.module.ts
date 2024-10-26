import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AwsModule } from '../aws/aws.module';

import { HelperEmailService } from './services/helper.email.service';
import { HelperEncryptionService } from './services/helper.encryption.service';
import { HelperPaginationService } from './services/helper.pagination.service';

@Module({
    imports: [AwsModule],
    providers: [
        JwtService,
        HelperEncryptionService,
        HelperEmailService,
        HelperPaginationService,
    ],
    exports: [
        HelperEncryptionService,
        HelperEmailService,
        HelperPaginationService,
    ],
})
export class HelperModule {}
