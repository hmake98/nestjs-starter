import { ConfigService } from './config.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
