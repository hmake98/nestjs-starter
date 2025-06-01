import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { DatabaseService } from 'src/common/database/services/database.service';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        $connect: jest.fn(),
        $queryRaw: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
    })),
}));

describe('DatabaseService', () => {
    let service: DatabaseService;
    let mockPrismaClient: jest.Mocked<PrismaClient>;

    beforeEach(async () => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseService],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);

        // Create a new PrismaClient mock instance
        mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
        Object.assign(service, mockPrismaClient);
    });

    afterEach(async () => {
        // Clean up after each test
        if (service && typeof service.$disconnect === 'function') {
            await service.$disconnect();
        }
    });

    describe('onModuleInit', () => {
        it('should call $connect on module initialization', async () => {
            // Arrange
            mockPrismaClient.$connect = jest.fn().mockResolvedValue(undefined);

            // Act
            await service.onModuleInit();

            // Assert
            expect(mockPrismaClient.$connect).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.$connect).toHaveBeenCalledWith();
        });

        it('should handle connection errors during module initialization', async () => {
            // Arrange
            const connectionError = new Error('Failed to connect to database');
            mockPrismaClient.$connect = jest
                .fn()
                .mockRejectedValue(connectionError);

            // Act & Assert
            await expect(service.onModuleInit()).rejects.toThrow(
                'Failed to connect to database'
            );
            expect(mockPrismaClient.$connect).toHaveBeenCalledTimes(1);
        });
    });

    describe('isHealthy', () => {
        it('should return status "up" when database query succeeds', async () => {
            // Arrange
            mockPrismaClient.$queryRaw = jest
                .fn()
                .mockResolvedValue([{ '1': 1 }]);

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'up',
                },
            });
            expect(mockPrismaClient.$queryRaw).toHaveBeenCalledTimes(1);
        });

        it('should return status "down" when database query fails', async () => {
            // Arrange
            const queryError = new Error('Database connection failed');
            mockPrismaClient.$queryRaw = jest
                .fn()
                .mockRejectedValue(queryError);

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'down',
                },
            });
            expect(mockPrismaClient.$queryRaw).toHaveBeenCalledTimes(1);
        });

        it('should return status "down" when database query throws unexpected error', async () => {
            // Arrange
            mockPrismaClient.$queryRaw = jest.fn().mockImplementation(() => {
                throw new Error('Unexpected database error');
            });

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'down',
                },
            });
            expect(mockPrismaClient.$queryRaw).toHaveBeenCalledTimes(1);
        });

        it('should handle non-Error exceptions in database query', async () => {
            // Arrange
            mockPrismaClient.$queryRaw = jest
                .fn()
                .mockRejectedValue('String error');

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'down',
                },
            });
            expect(mockPrismaClient.$queryRaw).toHaveBeenCalledTimes(1);
        });

        it('should handle null/undefined rejections in database query', async () => {
            // Arrange
            mockPrismaClient.$queryRaw = jest.fn().mockRejectedValue(null);

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'down',
                },
            });
            expect(mockPrismaClient.$queryRaw).toHaveBeenCalledTimes(1);
        });
    });

    describe('class instantiation', () => {
        it('should be defined and extend PrismaClient', () => {
            expect(service).toBeDefined();
            expect(service).toBeInstanceOf(PrismaClient);
        });

        it('should implement OnModuleInit interface', () => {
            expect(typeof service.onModuleInit).toBe('function');
        });

        it('should have isHealthy method', () => {
            expect(typeof service.isHealthy).toBe('function');
        });
    });

    describe('integration scenarios', () => {
        it('should handle module init followed by health check - success scenario', async () => {
            // Arrange
            mockPrismaClient.$connect = jest.fn().mockResolvedValue(undefined);
            mockPrismaClient.$queryRaw = jest
                .fn()
                .mockResolvedValue([{ '1': 1 }]);

            // Act
            await service.onModuleInit();
            const healthResult = await service.isHealthy();

            // Assert
            expect(mockPrismaClient.$connect).toHaveBeenCalledTimes(1);
            expect(healthResult).toEqual({
                prisma: {
                    status: 'up',
                },
            });
        });

        it('should handle module init followed by health check - failure scenario', async () => {
            // Arrange
            mockPrismaClient.$connect = jest.fn().mockResolvedValue(undefined);
            mockPrismaClient.$queryRaw = jest
                .fn()
                .mockRejectedValue(new Error('Query failed'));

            // Act
            await service.onModuleInit();
            const healthResult = await service.isHealthy();

            // Assert
            expect(mockPrismaClient.$connect).toHaveBeenCalledTimes(1);
            expect(healthResult).toEqual({
                prisma: {
                    status: 'down',
                },
            });
        });
    });
});
