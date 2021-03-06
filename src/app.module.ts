import { FileService } from './shared/services/file.service';
import { EmailService } from './shared/services/email.service';
import { AdminModule } from './modules/admin/admin.module';
import { AdminController } from './modules/admin/admin.controller';
import { TokenService } from './shared/services/token.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { UserController } from './modules/user/user.controller';
import { PostModule } from './modules';
import { PostController } from './modules/post/post.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './shared';
import { ConfigService } from './config/config.service';
import { BullModule } from '@nestjs/bull';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { HttpExceptionFilter } from './core/interceptors';
import { APP_FILTER } from '@nestjs/core';
import * as path from 'path'

@Module({
  imports: [
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
    ConfigModule,
    AdminModule,
    UserModule,
    PostModule,
    TerminusModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis').host,
          port: configService.get('redis').port,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController, HealthController, UserController, PostController],
  providers: [
    FileService,
    EmailService,
    TokenService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
