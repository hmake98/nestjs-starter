import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { JwtAccessGuard } from './guards/jwt.access.guard';
import { RolesGuard } from './guards/roles.guard';
import { RequestLoggerMiddleware } from './middlewares/request.middleware';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                throttlers: [
                    {
                        ttl: configService.get('app.throttle.ttl'),
                        limit: configService.get('app.throttle.limit'),
                    },
                ],
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAccessGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class RequestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
