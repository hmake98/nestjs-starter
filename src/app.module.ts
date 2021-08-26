import { TaskModule } from './shared/modules';
import { FileService } from './shared/services/file.service';
import { EmailService } from './shared/services/email.service';
import { AdminModule } from './modules/admin/admin.module';
import { AdminController } from './modules/admin/admin.controller';
import { TokenService } from './shared/services/token.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ConsoleModule } from 'nestjs-console';
import { UserController } from './modules/user/user.controller';
import { PostRepository, UserRepository } from './shared/repository';
import { PostModule } from './modules';
import { PostController } from './modules/post/post.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './interceptors/exception.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TaskModule,
    AdminModule,
    TerminusModule,
    ConfigModule,
    DatabaseModule,
    UserModule,
    ConsoleModule,
    PostModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AdminController, HealthController, UserController, PostController],
  providers: [
    FileService,
    EmailService,
    TokenService,
    Logger,
    UserRepository,
    PostRepository,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
