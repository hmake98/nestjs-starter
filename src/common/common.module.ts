import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

import { AuthModule } from './auth/auth.module';
import configs from './config';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';
import { LoggerModule } from './logger/logger.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        FileModule,

        LoggerModule,
        RequestModule,
        ResponseModule,

        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
        }),

        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    isGlobal: true,
                    store: redisStore,
                    host: configService.get('redis.host'),
                    port: configService.get('redis.port'),
                    password: configService.get('redis.password'),
                    tls: configService.get('redis.tls'),
                    ttl: 5000,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class CommonModule {}
