import { Module } from '@nestjs/common';

import { AwsS3Service } from './services/aws.s3.service';
import { AwsSESService } from './services/aws.ses.service';

@Module({
    providers: [AwsSESService, AwsS3Service],
    exports: [AwsSESService, AwsS3Service],
})
export class AwsModule {}
