import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { HealthController } from './health.controller';
import { EmailService, NotificationService, TaskService } from './shared';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { PostController } from './modules/post/post.controller';
import { UserController } from './modules/user/user.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    PostModule,
    UserModule,
    AuthModule,
    DatabaseModule,
    TerminusModule,
    ConsoleModule,
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ScheduleModule.forRoot(),
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis_host'),
          port: +configService.get('redis_port'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PostController, HealthController, UserController],
  providers: [EmailService, NotificationService, TaskService, ConfigService],
})
export class AppModule {}
