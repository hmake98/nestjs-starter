import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { HelperPrismaQueryBuilderService } from 'src/common/helper/services/helper.query.builder.service';
import { IQueryOptions } from 'src/common/helper/interfaces/query.builder.interface';

describe('HelperPrismaQueryBuilderService', () => {
    let service: HelperPrismaQueryBuilderService;
    let mockDelegate: jest.Mocked<any>;
    let module: TestingModule;

    beforeEach(async () => {
        mockDelegate = {
            findMany: jest.fn(),
            count: jest.fn(),
        };

        module = await Test.createTestingModule({
            providers: [HelperPrismaQueryBuilderService],
        }).compile();

        service = module.get<HelperPrismaQueryBuilderService>(
            HelperPrismaQueryBuilderService
        );
    });

    afterEach(async () => {
        jest.clearAllMocks();
        if (module) {
            await module.close();
        }
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('buildQuery', () => {
        it('should build basic query with pagination', async () => {
            const mockData = [{ id: '1', name: 'Test' }];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(1);

            const options: IQueryOptions = {
                page: 1,
                limit: 10,
            };

            const result = await service.buildQuery(mockDelegate, options);

            expect(result).toEqual({
                data: mockData,
                meta: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                },
            });

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle search query correctly', async () => {
            const mockData = [{ id: '1', name: 'John Doe' }];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(1);

            const options: IQueryOptions = {
                searchQuery: 'john',
                searchFields: ['name', 'email'],
                searchMode: 'insensitive',
            };

            const builderOptions = {
                allowedSearchFields: ['name', 'email'],
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
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
                            ],
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should filter search fields based on allowed fields', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                searchQuery: 'test',
                searchFields: ['name', 'email', 'secret'], // secret is not allowed
            };

            const builderOptions = {
                allowedSearchFields: ['name', 'email'], // only name and email allowed
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            OR: [
                                {
                                    name: {
                                        contains: 'test',
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    email: {
                                        contains: 'test',
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle basic filters correctly', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                filters: {
                    role: 'admin',
                    isActive: true,
                    tags: ['tag1', 'tag2'],
                },
            };

            const builderOptions = {
                allowedFilterFields: ['role', 'isActive', 'tags'],
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            role: 'admin',
                            isActive: true,
                            tags: { in: ['tag1', 'tag2'] },
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle date filters correctly', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                dateFilters: [
                    {
                        field: 'createdAt',
                        from: '2024-01-01',
                        to: '2024-12-31',
                    },
                ],
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            createdAt: {
                                gte: new Date('2024-01-01'),
                                lte: new Date('2024-12-31'),
                            },
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle range filters correctly', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                rangeFilters: [
                    {
                        field: 'price',
                        min: 10,
                        max: 100,
                    },
                ],
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            price: {
                                gte: 10,
                                lte: 100,
                            },
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle enum filters correctly', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                enumFilters: [
                    {
                        field: 'status',
                        values: ['ACTIVE', 'PENDING'],
                    },
                ],
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            status: { in: ['ACTIVE', 'PENDING'] },
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle custom sorting', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                sortBy: 'name',
                sortOrder: 'asc',
            };

            const builderOptions = {
                allowedSortFields: ['name', 'createdAt'],
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { name: 'asc' },
                skip: 0,
                take: 10,
            });
        });

        it('should throw error for unauthorized sort field', async () => {
            const options: IQueryOptions = {
                sortBy: 'secretField',
            };

            const builderOptions = {
                allowedSortFields: ['name', 'createdAt'],
            };

            await expect(
                service.buildQuery(mockDelegate, options, builderOptions)
            ).rejects.toThrow(BadRequestException);
        });

        it('should handle select and include options', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                select: { id: true, name: true },
                include: { posts: true },
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                select: { id: true, name: true },
                include: { posts: true },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should enforce maximum limit', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                limit: 1000, // Very large limit
            };

            const builderOptions = {
                maxLimit: 50,
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 50, // Should be limited to maxLimit
            });
        });

        it('should calculate pagination metadata correctly', async () => {
            const mockData = Array.from({ length: 10 }, (_, i) => ({
                id: `${i + 1}`,
            }));
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(25);

            const options: IQueryOptions = {
                page: 2,
                limit: 10,
            };

            const result = await service.buildQuery(mockDelegate, options);

            expect(result.meta).toEqual({
                total: 25,
                page: 2,
                limit: 10,
                totalPages: 3,
                hasNextPage: true,
                hasPrevPage: true,
            });
        });

        it('should handle complex query with multiple filters', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                page: 2,
                limit: 5,
                searchQuery: 'test',
                searchFields: ['name'],
                filters: { role: 'admin' },
                dateFilters: [{ field: 'createdAt', from: '2024-01-01' }],
                sortBy: 'name',
                sortOrder: 'desc',
            };

            const builderOptions = {
                allowedSearchFields: ['name'],
                allowedFilterFields: ['role'],
                allowedSortFields: ['name'],
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        { role: 'admin' },
                        {
                            OR: [
                                {
                                    name: {
                                        contains: 'test',
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                        { createdAt: { gte: new Date('2024-01-01') } },
                    ],
                },
                orderBy: { name: 'desc' },
                skip: 5, // (page 2 - 1) * limit 5
                take: 5,
            });
        });

        it('should clean undefined values from query', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                page: 1,
                searchQuery: undefined, // Should be ignored
                filters: { role: 'admin', empty: undefined }, // empty should be ignored
            };

            await service.buildQuery(mockDelegate, options);

            // Verify that undefined values are not included
            const calledWith = mockDelegate.findMany.mock.calls[0][0];
            expect(calledWith.where.AND[0]).toEqual({ role: 'admin' });
            expect(calledWith.where.AND[0]).not.toHaveProperty('empty');
        });
    });

    describe('buildCursorQuery', () => {
        it('should build cursor-based pagination query', async () => {
            const mockData = [
                { id: '1', name: 'Test 1' },
                { id: '2', name: 'Test 2' },
            ];
            mockDelegate.findMany.mockResolvedValue(mockData);

            const options: IQueryOptions = {
                limit: 5,
                cursor: { id: 'cursor-id' },
            };

            const result = await service.buildCursorQuery(
                mockDelegate,
                options
            );

            expect(result).toEqual({
                data: mockData,
                nextCursor: undefined, // No next page since we got fewer than limit + 1
            });

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                take: 6, // limit + 1 to check for next page
                cursor: { id: 'cursor-id' },
            });
        });

        it('should detect next page in cursor pagination', async () => {
            const mockData = Array.from({ length: 6 }, (_, i) => ({
                id: `${i + 1}`,
            }));
            mockDelegate.findMany.mockResolvedValue(mockData);

            const options: IQueryOptions = {
                limit: 5,
            };

            const result = await service.buildCursorQuery(
                mockDelegate,
                options
            );

            expect(result.data).toHaveLength(5); // Should return only limit items
            expect(result.nextCursor).toEqual({ id: '5' }); // Should set next cursor
        });
    });

    describe('edge cases', () => {
        it('should handle empty search fields', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                searchQuery: 'test',
                searchFields: [], // Empty array
            };

            await service.buildQuery(mockDelegate, options);

            // Should not add search conditions
            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle invalid page numbers', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                page: -1, // Invalid page
                limit: 10,
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 0, // Should default to page 1
                take: 10,
            });
        });

        it('should handle comma-separated filter values', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                filters: {
                    tags: 'tag1,tag2,tag3', // Comma-separated string
                },
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            tags: { in: ['tag1', 'tag2', 'tag3'] },
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle empty filters gracefully', async () => {
            const mockData = [];
            mockDelegate.findMany.mockResolvedValue(mockData);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                filters: {}, // Empty filters
                dateFilters: [], // Empty date filters
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should skip search when all search fields are filtered by allowedSearchFields', async () => {
            mockDelegate.findMany.mockResolvedValue([]);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                searchQuery: 'test',
                searchFields: ['password', 'secret'], // none of these are allowed
                searchMode: 'insensitive',
            };

            const builderOptions = {
                allowedSearchFields: ['name', 'email'], // only these are allowed
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            // Should not include search conditions since all fields were filtered out
            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle string filter values with commas', async () => {
            mockDelegate.findMany.mockResolvedValue([]);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                filters: {
                    tags: 'javascript,typescript,nodejs', // comma-separated string
                    category: 'tech', // normal string
                },
            };

            const builderOptions = {
                allowedFilterFields: ['tags', 'category'],
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            tags: {
                                in: ['javascript', 'typescript', 'nodejs'],
                            },
                            category: 'tech',
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should use custom orderBy when provided', async () => {
            mockDelegate.findMany.mockResolvedValue([]);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                orderBy: { name: 'asc', createdAt: 'desc' },
            };

            await service.buildQuery(mockDelegate, options);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                orderBy: { name: 'asc', createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should skip non-allowed filter fields', async () => {
            mockDelegate.findMany.mockResolvedValue([]);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                filters: {
                    name: 'John',
                    secretField: 'secret',
                    role: 'admin',
                },
            };

            const builderOptions = {
                allowedFilterFields: ['name', 'role'], // secretField not allowed
            };

            await service.buildQuery(mockDelegate, options, builderOptions);

            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            name: 'John',
                            role: 'admin',
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });

        it('should handle search without allowedSearchFields restriction', async () => {
            mockDelegate.findMany.mockResolvedValue([]);
            mockDelegate.count.mockResolvedValue(0);

            const options: IQueryOptions = {
                searchQuery: 'test',
                searchFields: ['name', 'email'],
            };

            const builderOptions = {}; // No allowedSearchFields specified

            await service.buildQuery(mockDelegate, options, builderOptions);

            // Should include all search fields when no restriction is set
            expect(mockDelegate.findMany).toHaveBeenCalledWith({
                where: {
                    AND: [
                        {
                            OR: [
                                {
                                    name: {
                                        contains: 'test',
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    email: {
                                        contains: 'test',
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
            });
        });
    });
});
