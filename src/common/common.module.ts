import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from '../config';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  controllers: [HealthController],
  providers: [],
  imports: [
    AuthModule,
    DatabaseModule,
    TerminusModule,
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
})
export class CommonModule {}
