import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { REDIS_CLIENT } from './constants/cache.constant';
import { CacheService } from './services/cache.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: (configService: ConfigService): Redis => {
                return new Redis(configService.getOrThrow<string>('redis.url'));
            },
        },
        CacheService,
    ],
    exports: [CacheService],
})
export class CacheModule {}
