import { Module } from '@nestjs/common';

import { AwsSESService } from './services/aws.ses.service';
import { AwsSNSService } from './services/aws.sns.service';

@Module({
    providers: [AwsSESService, AwsSNSService],
    exports: [AwsSESService, AwsSNSService],
})
export class AwsModule {}
