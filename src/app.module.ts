import * as path from 'path';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { HealthController } from './health.controller';
import { EmailService } from './shared/services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { PostController } from './modules/post/post.controller';
import { UserController } from './modules/user/user.controller';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmConfigService } from './database/typeorm.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    PostModule,
    UserModule,
    AuthModule,
    TerminusModule,
    ConsoleModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
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
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [PostController, HealthController, UserController],
  providers: [EmailService, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
