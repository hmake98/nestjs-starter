import { Test, type TestingModule } from '@nestjs/testing';
import { RedisService } from '@nestjs-redisx/core';

import { RedisXHealthService } from 'src/common/redisx/services/redisx.health.service';

describe('RedisXHealthService', () => {
    let service: RedisXHealthService;

    const mockRedisService = {
        ping: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RedisXHealthService,
                { provide: RedisService, useValue: mockRedisService },
            ],
        }).compile();

        service = module.get<RedisXHealthService>(RedisXHealthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('isHealthy', () => {
        it('reports up when redis answers the ping', async () => {
            mockRedisService.ping.mockResolvedValue('PONG');

            await expect(service.isHealthy()).resolves.toEqual({
                redis: { status: 'up' },
            });
        });

        it('reports down when the ping fails', async () => {
            mockRedisService.ping.mockRejectedValue(
                new Error('connection refused')
            );

            await expect(service.isHealthy()).resolves.toEqual({
                redis: { status: 'down' },
            });
        });
    });
});
