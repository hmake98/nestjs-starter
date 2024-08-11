import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { DatabaseModule } from '../database/database.module';

import { HealthController } from './controllers/health.controller';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, DatabaseModule],
})
export class HealthModule {}
