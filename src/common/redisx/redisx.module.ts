import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CachePlugin } from '@nestjs-redisx/cache';
import { RedisModule } from '@nestjs-redisx/core';
import { RateLimitPlugin } from '@nestjs-redisx/rate-limit';

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            plugins: [
                new CachePlugin(),
                RateLimitPlugin.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                        defaultPoints:
                            configService.getOrThrow<number>(
                                'app.throttle.limit'
                            ),
                        defaultDuration:
                            configService.getOrThrow<number>(
                                'app.throttle.ttl'
                            ),
                        // Keep serving traffic when Redis is unreachable
                        errorPolicy: 'fail-open' as const,
                        // Rejections travel through the application's own
                        // exception filter and response envelope
                        registerExceptionFilter: false,
                        errorFactory: () =>
                            new HttpException(
                                'http.error.429',
                                HttpStatus.TOO_MANY_REQUESTS
                            ),
                    }),
                }),
            ],
            useFactory: (configService: ConfigService) => ({
                clients: { url: configService.getOrThrow<string>('redis.url') },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class RedisXModule {}
