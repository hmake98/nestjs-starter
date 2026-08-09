import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BullMqModule } from './bullmq/bullmq.module';
import configs from './config';
import { DatabaseModule } from './database/database.module';
import { CustomLoggerModule } from './logger/logger.module';
import { RedisXModule } from './redisx/redisx.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';

@Module({
    imports: [
        // Configuration - Global
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
        }),

        // Core Infrastructure
        DatabaseModule,
        RedisXModule,

        // Cross-cutting Concerns
        CustomLoggerModule,
        RequestModule,
        ResponseModule,
        BullMqModule,
    ],
    exports: [DatabaseModule, RedisXModule],
})
export class CommonModule {}
