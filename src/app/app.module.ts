import { Module } from '@nestjs/common';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { UserModule } from '../modules/user/user.module';
import { PostModule } from '../modules/post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { CoreModule } from 'src/core/core.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
  controllers: [AppController],
  imports: [
    TerminusModule,
    CoreModule,
    CommonModule,
    HelperModule,
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../languages/'),
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
          port: Number(configService.get('redis.port')),
        },
      }),
      inject: [ConfigService],
    }),
    PostModule,
    UserModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
