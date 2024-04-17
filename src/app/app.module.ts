import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
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
