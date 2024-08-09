import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EncryptionService } from './services/encryption.service';

@Module({
  providers: [JwtService, EncryptionService],
  exports: [EncryptionService],
})
export class HelperModule {}
