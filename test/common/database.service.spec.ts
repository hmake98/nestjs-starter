import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from 'src/common/database/services/database.service';

describe('DatabaseService', () => {
    let service: DatabaseService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [DatabaseService],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);
    });

    afterEach(async () => {
        // Clean up mocks
        jest.restoreAllMocks();

        // Close the testing module
        if (module) {
            await module.close();
        }
    });

    describe('onModuleInit', () => {
        it('should call $connect on module initialization', async () => {
            // Arrange
            const connectSpy = jest
                .spyOn(service, '$connect')
                .mockResolvedValue(undefined);

            // Act
            await service.onModuleInit();

            // Assert
            expect(connectSpy).toHaveBeenCalledTimes(1);
            expect(connectSpy).toHaveBeenCalledWith();
        });

        it('should handle connection errors during module initialization', async () => {
            // Arrange
            const connectionError = new Error('Failed to connect to database');
            const connectSpy = jest
                .spyOn(service, '$connect')
                .mockRejectedValue(connectionError);

            // Act & Assert
            await expect(service.onModuleInit()).rejects.toThrow(
                'Failed to connect to database'
            );
            expect(connectSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('isHealthy', () => {
        it('should return status "up" when database query succeeds', async () => {
            // Arrange
            const queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockResolvedValue([{ '1': 1 }]);

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'up',
                },
            });
            expect(queryRawSpy).toHaveBeenCalledTimes(1);
            expect(queryRawSpy).toHaveBeenCalledWith(['SELECT 1']);
        });

        it('should return status "down" when database query fails', async () => {
            // Arrange
            const queryError = new Error('Database connection failed');
            const queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockRejectedValue(queryError);

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'down',
                },
            });
            expect(queryRawSpy).toHaveBeenCalledTimes(1);
        });

        it('should return status "down" when database query throws unexpected error', async () => {
            // Arrange
            const queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockImplementation(() => {
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
            expect(queryRawSpy).toHaveBeenCalledTimes(1);
        });

        it('should handle non-Error exceptions in database query', async () => {
            // Arrange
            const queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockRejectedValue('String error');

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'down',
                },
            });
            expect(queryRawSpy).toHaveBeenCalledTimes(1);
        });

        it('should handle null/undefined rejections in database query', async () => {
            // Arrange
            const queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockRejectedValue(null);

            // Act
            const result = await service.isHealthy();

            // Assert
            expect(result).toEqual({
                prisma: {
                    status: 'down',
                },
            });
            expect(queryRawSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('class instantiation', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        it('should implement OnModuleInit interface', () => {
            expect(typeof service.onModuleInit).toBe('function');
        });

        it('should have isHealthy method', () => {
            expect(typeof service.isHealthy).toBe('function');
        });

        it('should have Prisma client methods', () => {
            expect(typeof service.$connect).toBe('function');
            expect(typeof service.$disconnect).toBe('function');
            expect(typeof service.$queryRaw).toBe('function');
        });
    });

    describe('integration scenarios', () => {
        it('should handle module init followed by health check - success scenario', async () => {
            // Arrange
            const connectSpy = jest
                .spyOn(service, '$connect')
                .mockResolvedValue(undefined);
            const _queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockResolvedValue([{ '1': 1 }]);

            // Act
            await service.onModuleInit();
            const healthResult = await service.isHealthy();

            // Assert
            expect(connectSpy).toHaveBeenCalledTimes(1);
            expect(healthResult).toEqual({
                prisma: {
                    status: 'up',
                },
            });
        });

        it('should handle module init followed by health check - failure scenario', async () => {
            // Arrange
            const connectSpy = jest
                .spyOn(service, '$connect')
                .mockResolvedValue(undefined);
            const _queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockRejectedValue(new Error('Query failed'));

            // Act
            await service.onModuleInit();
            const healthResult = await service.isHealthy();

            // Assert
            expect(connectSpy).toHaveBeenCalledTimes(1);
            expect(healthResult).toEqual({
                prisma: {
                    status: 'down',
                },
            });
        });

        it('should handle connection failure during init but successful health check', async () => {
            // Arrange
            const _connectSpy = jest
                .spyOn(service, '$connect')
                .mockRejectedValue(new Error('Initial connection failed'));
            const _queryRawSpy = jest
                .spyOn(service, '$queryRaw')
                .mockResolvedValue([{ '1': 1 }]);

            // Act & Assert
            await expect(service.onModuleInit()).rejects.toThrow(
                'Initial connection failed'
            );

            // Health check should still work independently
            const healthResult = await service.isHealthy();
            expect(healthResult).toEqual({
                prisma: {
                    status: 'up',
                },
            });
        });
    });
});
