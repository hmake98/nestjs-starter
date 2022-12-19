import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { ErrorExceptionsFilter } from './core/interceptors';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { isDev } from './utils/common';
import { HealthController } from './health.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EmailService } from './shared/services/email.service';
import { TokenService } from './shared/services/token.service';
import * as path from 'path';
import { DatabaseModule } from './database/database.module';
import {
  FileController,
  FileModule,
  PostController,
  PostModule,
  UserController,
  UserModule,
} from './modules';

@Module({
  imports: [
    DatabaseModule,
    TerminusModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: isDev ? 'debug' : 'info',
        transport: isDev
          ? { target: 'pino-pretty', options: { singleLine: true } }
          : undefined,
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    }),
    FileModule,
    PostModule,
    UserModule,
  ],
  controllers: [
    FileController,
    PostController,
    HealthController,
    UserController,
  ],
  providers: [
    EmailService,
    TokenService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
