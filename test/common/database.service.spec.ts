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
const MockPrismaClient = PrismaClient as jest.MockedClass<typeof PrismaClient>;

describe('DatabaseService', () => {
    let service: DatabaseService;
    let module: TestingModule;
    let mockPoolEnd: jest.Mock;

    beforeEach(async () => {
        mockPoolEnd = jest.fn().mockResolvedValue(undefined);
        MockPool.mockImplementation(
            () => ({ end: mockPoolEnd }) as unknown as Pool
        );
        MockPrismaPg.mockImplementation(() => ({}) as unknown as PrismaPg);
        MockPrismaClient.prototype.$connect = jest
            .fn()
            .mockResolvedValue(undefined);
        MockPrismaClient.prototype.$disconnect = jest
            .fn()
            .mockResolvedValue(undefined);
        MockPrismaClient.prototype.$queryRaw = jest
            .fn()
            .mockResolvedValue([{ '?column?': 1 }]);

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
        if (module) await module.close();
    });

    describe('class instantiation', () => {
        it('should be defined', () => expect(service).toBeDefined());

        it('should implement OnModuleInit', () =>
            expect(typeof service.onModuleInit).toBe('function'));

        it('should implement OnModuleDestroy', () =>
            expect(typeof service.onModuleDestroy).toBe('function'));

        it('should have isHealthy method', () =>
            expect(typeof service.isHealthy).toBe('function'));
    });

    describe('onModuleInit', () => {
        it('connects on init', async () => {
            await service.onModuleInit();
            expect(MockPrismaClient.prototype.$connect).toHaveBeenCalledTimes(
                1
            );
        });

        it('propagates connection errors', async () => {
            (
                MockPrismaClient.prototype.$connect as jest.Mock
            ).mockRejectedValueOnce(new Error('Connection failed'));
            await expect(service.onModuleInit()).rejects.toThrow(
                'Connection failed'
            );
        });
    });

    describe('onModuleDestroy', () => {
        it('disconnects prisma and ends pool', async () => {
            await service.onModuleDestroy();
            expect(
                MockPrismaClient.prototype.$disconnect
            ).toHaveBeenCalledTimes(1);
            expect(mockPoolEnd).toHaveBeenCalledTimes(1);
        });

        it('propagates disconnect errors', async () => {
            (
                MockPrismaClient.prototype.$disconnect as jest.Mock
            ).mockRejectedValueOnce(new Error('Disconnect failed'));
            await expect(service.onModuleDestroy()).rejects.toThrow(
                'Disconnect failed'
            );
        });
    });

    describe('isHealthy', () => {
        it('returns up when query succeeds', async () => {
            const result = await service.isHealthy();
            expect(result).toEqual({ prisma: { status: 'up' } });
        });

        it('returns down when query throws', async () => {
            (
                MockPrismaClient.prototype.$queryRaw as jest.Mock
            ).mockRejectedValueOnce(new Error('DB error'));
            const result = await service.isHealthy();
            expect(result).toEqual({ prisma: { status: 'down' } });
        });

        it('returns down on non-Error rejection', async () => {
            (
                MockPrismaClient.prototype.$queryRaw as jest.Mock
            ).mockRejectedValueOnce('string error');
            const result = await service.isHealthy();
            expect(result).toEqual({ prisma: { status: 'down' } });
        });
    });
});
