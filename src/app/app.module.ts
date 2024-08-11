import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { CommonModule } from 'src/common/common.module';
import { HealthModule } from 'src/common/health/health.module';
import { CoreModule } from 'src/core/core.module';
import { WorkerModule } from 'src/workers/worker.module';

import { PostModule } from '../modules/post/post.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [
    CoreModule,
    CommonModule,
    WorkerModule,
    HealthModule,

    PostModule,
    UserModule,

    ScheduleModule.forRoot(),
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
  ],
})
export class AppModule {}
