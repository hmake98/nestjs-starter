import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AwsModule } from '../aws/aws.module';

import { HelperEmailService } from './services/helper.email.service';
import { HelperEncryptionService } from './services/helper.encryption.service';

@Module({
  imports: [AwsModule],
  providers: [JwtService, HelperEncryptionService, HelperEmailService],
  exports: [HelperEncryptionService, HelperEmailService],
})
export class HelperModule {}
