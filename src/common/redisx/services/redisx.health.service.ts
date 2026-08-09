import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { RedisService } from '@nestjs-redisx/core';

@Injectable()
export class RedisXHealthService {
    constructor(private readonly redisService: RedisService) {}

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.redisService.ping();
            return { redis: { status: 'up' } };
        } catch {
            return { redis: { status: 'down' } };
        }
    }
}
