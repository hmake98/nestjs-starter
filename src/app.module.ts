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
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    AdminModule,
    TerminusModule,
    ConfigModule,
    DatabaseModule,
    UserModule,
    ConsoleModule,
    PostModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
  ],
  controllers: [AdminController, HealthController, UserController, PostController],
  providers: [FileService, EmailService, TokenService, Logger, UserRepository, PostRepository],
})
export class AppModule {}
