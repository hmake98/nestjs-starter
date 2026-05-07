import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

import { DatabaseService } from 'src/common/database/services/database.service';

jest.mock('pg');
jest.mock('@prisma/adapter-pg');
jest.mock('@prisma/client');

const MockPool = Pool as jest.MockedClass<typeof Pool>;
const MockPrismaPg = PrismaPg as jest.MockedClass<typeof PrismaPg>;
const MockPrismaClient = PrismaClient;

describe('DatabaseService', () => {
    let service: DatabaseService;
    let module: TestingModule;
    let mockPrismaInstance: {
        $connect: jest.Mock;
        $disconnect: jest.Mock;
        $queryRaw: jest.Mock;
        user: object;
    };
    let mockPoolInstance: { end: jest.Mock };

    beforeEach(async () => {
        mockPrismaInstance = {
            $connect: jest.fn().mockResolvedValue(undefined),
            $disconnect: jest.fn().mockResolvedValue(undefined),
            $queryRaw: jest.fn().mockResolvedValue([{ '1': 1 }]),
            user: {},
        };

        mockPoolInstance = {
            end: jest.fn().mockResolvedValue(undefined),
        };

        MockPool.mockImplementation(() => mockPoolInstance as unknown as Pool);
        MockPrismaPg.mockImplementation(() => ({}) as unknown as PrismaPg);
        MockPrismaClient.mockImplementation(
            () => mockPrismaInstance as unknown as PrismaClient
        );

        module = await Test.createTestingModule({
            providers: [
                DatabaseService,
                {
                    provide: ConfigService,
                    useValue: {
                        getOrThrow: jest
                            .fn()
                            .mockReturnValue(
                                'postgresql://localhost:5432/test'
                            ),
                    },
                },
            ],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);
    });

    afterEach(async () => {
        if (module) {
            await module.close();
        }
    });

    describe('onModuleInit', () => {
        it('should call $connect on module initialization', async () => {
            await service.onModuleInit();

            expect(mockPrismaInstance.$connect).toHaveBeenCalledTimes(1);
        });

        it('should handle connection errors during module initialization', async () => {
            const connectionError = new Error('Failed to connect to database');
            mockPrismaInstance.$connect.mockRejectedValueOnce(connectionError);

            await expect(service.onModuleInit()).rejects.toThrow(
                'Failed to connect to database'
            );
        });
    });

    describe('onModuleDestroy', () => {
        it('should call $disconnect and pool.end on destroy', async () => {
            await service.onModuleDestroy();

            expect(mockPrismaInstance.$disconnect).toHaveBeenCalledTimes(1);
            expect(mockPoolInstance.end).toHaveBeenCalledTimes(1);
        });

        it('should handle errors during disconnect', async () => {
            const disconnectError = new Error('Disconnect failed');
            mockPrismaInstance.$disconnect.mockRejectedValueOnce(
                disconnectError
            );

            await expect(service.onModuleDestroy()).rejects.toThrow(
                'Disconnect failed'
            );
        });
    });

    describe('isHealthy', () => {
        it('should return status "up" when database query succeeds', async () => {
            mockPrismaInstance.$queryRaw.mockResolvedValueOnce([{ '1': 1 }]);

            const result = await service.isHealthy();

            expect(result).toEqual({ prisma: { status: 'up' } });
            expect(mockPrismaInstance.$queryRaw).toHaveBeenCalledTimes(1);
        });

        it('should return status "down" when database query fails', async () => {
            mockPrismaInstance.$queryRaw.mockRejectedValueOnce(
                new Error('Database connection failed')
            );

            const result = await service.isHealthy();

            expect(result).toEqual({ prisma: { status: 'down' } });
        });

        it('should return status "down" when database query throws synchronously', async () => {
            mockPrismaInstance.$queryRaw.mockImplementationOnce(() => {
                throw new Error('Unexpected database error');
            });

            const result = await service.isHealthy();

            expect(result).toEqual({ prisma: { status: 'down' } });
        });

        it('should handle non-Error exceptions', async () => {
            mockPrismaInstance.$queryRaw.mockRejectedValueOnce('String error');

            const result = await service.isHealthy();

            expect(result).toEqual({ prisma: { status: 'down' } });
        });

        it('should handle null rejections', async () => {
            mockPrismaInstance.$queryRaw.mockRejectedValueOnce(null);

            const result = await service.isHealthy();

            expect(result).toEqual({ prisma: { status: 'down' } });
        });
    });

    describe('class instantiation', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        it('should implement OnModuleInit interface', () => {
            expect(typeof service.onModuleInit).toBe('function');
        });

        it('should implement OnModuleDestroy interface', () => {
            expect(typeof service.onModuleDestroy).toBe('function');
        });

        it('should have isHealthy method', () => {
            expect(typeof service.isHealthy).toBe('function');
        });

        it('should expose user model', () => {
            expect(service.user).toBeDefined();
        });
    });

    describe('integration scenarios', () => {
        it('should handle module init followed by health check - success scenario', async () => {
            mockPrismaInstance.$queryRaw.mockResolvedValueOnce([{ '1': 1 }]);

            await service.onModuleInit();
            const healthResult = await service.isHealthy();

            expect(mockPrismaInstance.$connect).toHaveBeenCalledTimes(1);
            expect(healthResult).toEqual({ prisma: { status: 'up' } });
        });

        it('should handle module init followed by health check - failure scenario', async () => {
            mockPrismaInstance.$queryRaw.mockRejectedValueOnce(
                new Error('Query failed')
            );

            await service.onModuleInit();
            const healthResult = await service.isHealthy();

            expect(mockPrismaInstance.$connect).toHaveBeenCalledTimes(1);
            expect(healthResult).toEqual({ prisma: { status: 'down' } });
        });

        it('should handle connection failure during init but successful health check', async () => {
            mockPrismaInstance.$connect.mockRejectedValueOnce(
                new Error('Initial connection failed')
            );
            mockPrismaInstance.$queryRaw.mockResolvedValueOnce([{ '1': 1 }]);

            await expect(service.onModuleInit()).rejects.toThrow(
                'Initial connection failed'
            );

            const healthResult = await service.isHealthy();
            expect(healthResult).toEqual({ prisma: { status: 'up' } });
        });
    });
});
