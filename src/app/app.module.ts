import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from 'src/common/common.module';
import { CoreModule } from 'src/core/core.module';
import { HelperModule } from 'src/common/helper/helper.module';

import { PostModule } from '../modules/post/post.module';
import { UserModule } from '../modules/user/user.module';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
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
    TerminusModule,
    CoreModule,
    CommonModule,
    HelperModule,
    ScheduleModule.forRoot(),
    PostModule,
    UserModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
