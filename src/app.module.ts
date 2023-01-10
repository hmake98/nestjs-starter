import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { HealthController } from './health.controller';
import { EmailService, NotificationService, TaskService } from './shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { PostController } from './modules/post/post.controller';
import { UserController } from './modules/user/user.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    PostModule,
    UserModule,
    AuthModule,
    DatabaseModule,
    TerminusModule,
    ConsoleModule,
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
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [PostController, HealthController, UserController],
  providers: [EmailService, NotificationService, TaskService],
})
export class AppModule {}
