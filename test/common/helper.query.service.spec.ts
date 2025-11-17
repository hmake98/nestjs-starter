import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { HelperQueryService } from 'src/common/helper/services/helper.query.service';

describe('HelperQueryService', () => {
    let service: HelperQueryService;
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
                HelperQueryService,
                {
                    provide: PinoLogger,
                    useValue: loggerMock,
                },
            ],
        }).compile();

        service = module.get<HelperQueryService>(HelperQueryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('query', () => {
        it('should create a new QueryBuilder instance', () => {
            const mockDelegate = {
                findMany: jest.fn(),
                count: jest.fn(),
            };

            const builder = service.query(mockDelegate);

            expect(builder).toBeDefined();
        });
    });

    describe('QueryBuilder', () => {
        let mockDelegate: any;

        beforeEach(() => {
            mockDelegate = {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                count: jest.fn(),
            };
        });

        describe('execute', () => {
            it('should execute paginated query successfully', async () => {
                const mockItems = [
                    { id: '1', name: 'Test 1' },
                    { id: '2', name: 'Test 2' },
                ];
                mockDelegate.count.mockResolvedValue(25);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                const result = await service
                    .query(mockDelegate)
                    .paginate({ page: 1, limit: 10 })
                    .execute();

                expect(result).toEqual({
                    metadata: {
                        totalItems: 25,
                        itemsPerPage: 10,
                        totalPages: 3,
                        currentPage: 1,
                    },
                    items: mockItems,
                });

                expect(mockDelegate.count).toHaveBeenCalledWith({ where: {} });
                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                });
            });

            it('should handle search in execute', async () => {
                const mockItems = [{ id: '1', name: 'John Doe' }];
                mockDelegate.count.mockResolvedValue(1);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                const _result = await service
                    .query(mockDelegate)
                    .search('john', ['name', 'email'])
                    .execute();

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
                    take: 10,
                    skip: 0,
                });
            });

            it('should skip search if query is empty', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .search('', ['name'])
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                });
            });

            it('should skip search if fields is empty', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service.query(mockDelegate).search('john', []).execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                });
            });

            it('should handle filters in execute', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .filter({ role: 'USER', isActive: true })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {
                        AND: [{ role: 'USER', isActive: true }],
                    },
                    take: 10,
                    skip: 0,
                });
            });

            it('should filter out null and undefined values', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .filter({
                        role: 'USER',
                        status: null,
                        age: undefined,
                        name: '',
                    })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {
                        AND: [{ role: 'USER' }],
                    },
                    take: 10,
                    skip: 0,
                });
            });

            it('should skip filters if empty', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service.query(mockDelegate).filter({}).execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                });
            });

            it('should handle custom where conditions', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .where({ createdAt: { gte: new Date('2023-01-01') } })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {
                        AND: [{ createdAt: { gte: new Date('2023-01-01') } }],
                    },
                    take: 10,
                    skip: 0,
                });
            });

            it('should skip where if condition is empty', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service.query(mockDelegate).where({}).execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                });
            });

            it('should handle sorting', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .sort({ createdAt: 'desc', name: 'asc' })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                    orderBy: { createdAt: 'desc', name: 'asc' },
                });
            });

            it('should handle include', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .include({
                        posts: true,
                        profile: { select: { bio: true } },
                    })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                    include: {
                        posts: true,
                        profile: { select: { bio: true } },
                    },
                });
            });

            it('should handle select', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(0);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .select({ id: true, name: true, email: true })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                    select: { id: true, name: true, email: true },
                });
            });

            it('should handle pagination with custom page and limit', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(100);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .paginate({ page: 3, limit: 20 })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 20,
                    skip: 40,
                });
            });

            it('should enforce max limit', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(100);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .paginate({ page: 1, limit: 200 })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 100,
                    skip: 0,
                });
            });

            it('should enforce min page number', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(100);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .paginate({ page: -1, limit: 10 })
                    .execute();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    take: 10,
                    skip: 0,
                });
            });

            it('should chain multiple methods', async () => {
                const mockItems = [];
                mockDelegate.count.mockResolvedValue(5);
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .paginate({ page: 2, limit: 5 })
                    .search('test', ['name'])
                    .filter({ role: 'USER' })
                    .sort({ createdAt: 'desc' })
                    .include({ posts: true })
                    .execute();

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
                                ],
                            },
                            { role: 'USER' },
                        ],
                    },
                    take: 5,
                    skip: 5,
                    orderBy: { createdAt: 'desc' },
                    include: { posts: true },
                });
            });

            it('should throw and log error on execute failure', async () => {
                const mockError = new Error('Database error');
                mockDelegate.count.mockRejectedValue(mockError);

                await expect(
                    service.query(mockDelegate).execute()
                ).rejects.toThrow(mockError);

                expect(loggerMock.error).toHaveBeenCalledWith(
                    'Query execution failed: Database error'
                );
            });
        });

        describe('getMany', () => {
            it('should execute query without pagination', async () => {
                const mockItems = [
                    { id: '1', name: 'Test 1' },
                    { id: '2', name: 'Test 2' },
                    { id: '3', name: 'Test 3' },
                ];
                mockDelegate.findMany.mockResolvedValue(mockItems);

                const result = await service
                    .query(mockDelegate)
                    .filter({ role: 'USER' })
                    .getMany();

                expect(result).toEqual(mockItems);
                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {
                        AND: [{ role: 'USER' }],
                    },
                });
            });

            it('should handle sorting in getMany', async () => {
                const mockItems = [];
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .sort({ name: 'asc' })
                    .getMany();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    orderBy: { name: 'asc' },
                });
            });

            it('should handle include in getMany', async () => {
                const mockItems = [];
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .include({ posts: true })
                    .getMany();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    include: { posts: true },
                });
            });

            it('should handle select in getMany', async () => {
                const mockItems = [];
                mockDelegate.findMany.mockResolvedValue(mockItems);

                await service
                    .query(mockDelegate)
                    .select({ id: true, name: true })
                    .getMany();

                expect(mockDelegate.findMany).toHaveBeenCalledWith({
                    where: {},
                    select: { id: true, name: true },
                });
            });

            it('should throw and log error on getMany failure', async () => {
                const mockError = new Error('Database error');
                mockDelegate.findMany.mockRejectedValue(mockError);

                await expect(
                    service.query(mockDelegate).getMany()
                ).rejects.toThrow(mockError);

                expect(loggerMock.error).toHaveBeenCalledWith(
                    'Query execution failed: Database error'
                );
            });
        });

        describe('getFirst', () => {
            it('should return first result', async () => {
                const mockItem = { id: '1', name: 'Test 1' };
                mockDelegate.findFirst.mockResolvedValue(mockItem);

                const result = await service
                    .query(mockDelegate)
                    .filter({ email: 'test@example.com' })
                    .getFirst();

                expect(result).toEqual(mockItem);
                expect(mockDelegate.findFirst).toHaveBeenCalledWith({
                    where: {
                        AND: [{ email: 'test@example.com' }],
                    },
                });
            });

            it('should return null if no result found', async () => {
                mockDelegate.findFirst.mockResolvedValue(null);

                const result = await service.query(mockDelegate).getFirst();

                expect(result).toBeNull();
            });

            it('should handle sorting in getFirst', async () => {
                const mockItem = { id: '1', name: 'Test 1' };
                mockDelegate.findFirst.mockResolvedValue(mockItem);

                await service
                    .query(mockDelegate)
                    .sort({ createdAt: 'desc' })
                    .getFirst();

                expect(mockDelegate.findFirst).toHaveBeenCalledWith({
                    where: {},
                    orderBy: { createdAt: 'desc' },
                });
            });

            it('should handle include in getFirst', async () => {
                const mockItem = null;
                mockDelegate.findFirst.mockResolvedValue(mockItem);

                await service
                    .query(mockDelegate)
                    .include({ profile: true })
                    .getFirst();

                expect(mockDelegate.findFirst).toHaveBeenCalledWith({
                    where: {},
                    include: { profile: true },
                });
            });

            it('should handle select in getFirst', async () => {
                const mockItem = null;
                mockDelegate.findFirst.mockResolvedValue(mockItem);

                await service
                    .query(mockDelegate)
                    .select({ id: true })
                    .getFirst();

                expect(mockDelegate.findFirst).toHaveBeenCalledWith({
                    where: {},
                    select: { id: true },
                });
            });

            it('should throw and log error on getFirst failure', async () => {
                const mockError = new Error('Database error');
                mockDelegate.findFirst.mockRejectedValue(mockError);

                await expect(
                    service.query(mockDelegate).getFirst()
                ).rejects.toThrow(mockError);

                expect(loggerMock.error).toHaveBeenCalledWith(
                    'Query execution failed: Database error'
                );
            });
        });

        describe('count', () => {
            it('should return count of records', async () => {
                mockDelegate.count.mockResolvedValue(42);

                const result = await service
                    .query(mockDelegate)
                    .filter({ role: 'ADMIN' })
                    .count();

                expect(result).toBe(42);
                expect(mockDelegate.count).toHaveBeenCalledWith({
                    where: {
                        AND: [{ role: 'ADMIN' }],
                    },
                });
            });

            it('should return count without filters', async () => {
                mockDelegate.count.mockResolvedValue(100);

                const result = await service.query(mockDelegate).count();

                expect(result).toBe(100);
                expect(mockDelegate.count).toHaveBeenCalledWith({
                    where: {},
                });
            });

            it('should throw and log error on count failure', async () => {
                const mockError = new Error('Database error');
                mockDelegate.count.mockRejectedValue(mockError);

                await expect(
                    service.query(mockDelegate).count()
                ).rejects.toThrow(mockError);

                expect(loggerMock.error).toHaveBeenCalledWith(
                    'Count failed: Database error'
                );
            });
        });
    });
});
