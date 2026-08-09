import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from '@nestjs-redisx/rate-limit';

import { JwtAccessGuard } from './guards/jwt-access.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
    providers: [
        { provide: APP_GUARD, useClass: RateLimitGuard },
        { provide: APP_GUARD, useClass: JwtAccessGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class RequestModule {}
