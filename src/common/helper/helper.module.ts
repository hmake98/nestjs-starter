import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AwsModule } from '../aws/aws.module';

import { HelperEmailService } from './services/helper.email.service';
import { HelperEncryptionService } from './services/helper.encryption.service';
import { HelperPaginationService } from './services/helper.pagination.service';
import { HelperPrismaQueryBuilderService } from './services/helper.query.builder.service';
import { HelperQueryService } from './services/helper.query.service';

@Module({
    imports: [AwsModule],
    providers: [
        JwtService,
        HelperEncryptionService,
        HelperEmailService,
        HelperPaginationService,
        HelperPrismaQueryBuilderService,
        HelperQueryService,
    ],
    exports: [
        HelperEncryptionService,
        HelperEmailService,
        HelperPaginationService,
        HelperPrismaQueryBuilderService,
        HelperQueryService,
    ],
})
export class HelperModule {}
