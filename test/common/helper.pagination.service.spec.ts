import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { PrismaDelegate } from 'src/common/helper/interfaces/pagination.interface';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';

describe('HelperPaginationService', () => {
    let service: HelperPaginationService;
    let loggerMock: jest.Mocked<PinoLogger>;

    beforeEach(async () => {
        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            trace: jest.fn(),
            fatal: jest.fn(),
            setContext: jest.fn(),
        } as unknown as jest.Mocked<PinoLogger>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HelperPaginationService,
                {
                    provide: PinoLogger,
                    useValue: loggerMock,
                },
            ],
        }).compile();

        service = module.get<HelperPaginationService>(HelperPaginationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('paginate', () => {
        let mockDelegate: jest.Mocked<PrismaDelegate>;

        beforeEach(() => {
            mockDelegate = {
                count: jest.fn(),
                findMany: jest.fn(),
            };
        });

        it('should return paginated data with correct metadata', async () => {
            // Mock data
            const totalItems = 25;
            const mockItems = [
                { id: '1', name: 'Item 1' },
                { id: '2', name: 'Item 2' },
            ];
            const page = 2;
            const limit = 10;

            // Mock delegate responses
            mockDelegate.count.mockResolvedValue(totalItems);
            mockDelegate.findMany.mockResolvedValue(mockItems);

            // Test pagination
            const result = await service.paginate(
                mockDelegate,
                { page, limit },
                { where: { type: 'test' } }
            );

            // Verify results
            expect(result).toEqual({
                metadata: {
                    totalItems,
                    itemsPerPage: limit,
                    totalPages: 3,
                    currentPage: page,
                },
                items: mockItems,
            });

            // Verify delegate calls
            expect(mockDelegate.count).toHaveBeenCalledWith({
                where: { type: 'test' },
            });
            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: { type: 'test' },
                take: limit,
                skip: 10, // (page - 1) * limit
            });
        });

        it('should handle first page correctly', async () => {
            const page = 1;
            const limit = 5;

            mockDelegate.count.mockResolvedValue(10);
            mockDelegate.findMany.mockResolvedValue([]);

            await service.paginate(mockDelegate, { page, limit });

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                take: limit,
                skip: 0,
            });
        });

        it('should handle empty results', async () => {
            mockDelegate.count.mockResolvedValue(0);
            mockDelegate.findMany.mockResolvedValue([]);

            const result = await service.paginate(mockDelegate, {
                page: 1,
                limit: 10,
            });

            expect(result).toEqual({
                metadata: {
                    totalItems: 0,
                    itemsPerPage: 10,
                    totalPages: 0,
                    currentPage: 1,
                },
                items: [],
            });
        });

        it('should pass through additional options', async () => {
            const options = {
                where: { status: 'active' },
                orderBy: { createdAt: 'desc' as const },
                include: { author: true },
            };

            mockDelegate.count.mockResolvedValue(5);
            mockDelegate.findMany.mockResolvedValue([]);

            await service.paginate(
                mockDelegate,
                { page: 1, limit: 10 },
                options
            );

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                ...options,
                take: 10,
                skip: 0,
            });
        });

        it('should handle large datasets correctly', async () => {
            const totalItems = 1000;
            const page = 5;
            const limit = 20;

            mockDelegate.count.mockResolvedValue(totalItems);
            mockDelegate.findMany.mockResolvedValue([]);

            const result = await service.paginate(mockDelegate, {
                page,
                limit,
            });

            expect(result.metadata).toEqual({
                totalItems,
                itemsPerPage: limit,
                totalPages: 50, // 1000 / 20
                currentPage: page,
            });
            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                take: limit,
                skip: 80, // (5-1) * 20
            });
        });

        it('should reject if count fails', async () => {
            const error = new Error('Database error');
            mockDelegate.count.mockRejectedValue(error);

            await expect(
                service.paginate(mockDelegate, { page: 1, limit: 10 })
            ).rejects.toThrow(error);
        });

        it('should reject if findMany fails', async () => {
            const error = new Error('Database error');
            mockDelegate.count.mockResolvedValue(10);
            mockDelegate.findMany.mockRejectedValue(error);

            await expect(
                service.paginate(mockDelegate, { page: 1, limit: 10 })
            ).rejects.toThrow(error);
        });
    });

    describe('buildSearchCondition', () => {
        it('should build search condition for multiple fields', () => {
            const searchQuery = 'john';
            const fields = ['name', 'email', 'username'];

            const result = service.buildSearchCondition(searchQuery, fields);

            expect(result).toEqual({
                OR: [
                    {
                        name: {
                            contains: 'john',
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: 'john',
                            mode: 'insensitive',
                        },
                    },
                    {
                        username: {
                            contains: 'john',
                            mode: 'insensitive',
                        },
                    },
                ],
            });
        });

        it('should build search condition for single field', () => {
            const searchQuery = 'test';
            const fields = ['description'];

            const result = service.buildSearchCondition(searchQuery, fields);

            expect(result).toEqual({
                OR: [
                    {
                        description: {
                            contains: 'test',
                            mode: 'insensitive',
                        },
                    },
                ],
            });
        });

        it('should return null if searchQuery is empty', () => {
            const result = service.buildSearchCondition('', ['name', 'email']);

            expect(result).toBeNull();
        });

        it('should return null if searchQuery is undefined', () => {
            const result = service.buildSearchCondition(null, [
                'name',
                'email',
            ]);

            expect(result).toBeNull();
        });

        it('should return null if fields array is empty', () => {
            const result = service.buildSearchCondition('john', []);

            expect(result).toBeNull();
        });

        it('should handle special characters in search query', () => {
            const searchQuery = 'test@example.com';
            const fields = ['email'];

            const result = service.buildSearchCondition(searchQuery, fields);

            expect(result).toEqual({
                OR: [
                    {
                        email: {
                            contains: 'test@example.com',
                            mode: 'insensitive',
                        },
                    },
                ],
            });
        });

        it('should handle multiple fields with spaces', () => {
            const searchQuery = 'John Doe';
            const fields = ['firstName', 'lastName', 'fullName'];

            const result = service.buildSearchCondition(searchQuery, fields);

            expect(result).toEqual({
                OR: [
                    {
                        firstName: {
                            contains: 'John Doe',
                            mode: 'insensitive',
                        },
                    },
                    {
                        lastName: {
                            contains: 'John Doe',
                            mode: 'insensitive',
                        },
                    },
                    {
                        fullName: {
                            contains: 'John Doe',
                            mode: 'insensitive',
                        },
                    },
                ],
            });
        });
    });
});
