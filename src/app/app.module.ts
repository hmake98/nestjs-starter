import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { HealthController } from '../common/health/health.controller';
import { EmailService, TaskService } from '../shared/services';
import { UserModule } from '../modules/user/user.module';
import { PostModule } from '../modules/post/post.module';
import { PostController } from '../modules/post/controllers/post.controller';
import { UserController } from '../modules/user/controllers/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { CoreModule } from 'src/core/core.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    CoreModule,
    CommonModule,
    ConsoleModule,
    TerminusModule,
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../i18n/'),
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
          host: configService.get('redis.host'),
          port: +configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    PostModule,
    UserModule,
  ],
  controllers: [PostController, HealthController, UserController],
  providers: [EmailService, TaskService, ConfigService],
})
export class AppModule {}
