import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from 'src/common/database/services/database.service';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';
import { PostCreateDto } from 'src/modules/post/dtos/request/post.create.request';
import { PostGetDto } from 'src/modules/post/dtos/request/post.get.request';
import { PostUpdateDto } from 'src/modules/post/dtos/request/post.update.request';
import { PostService } from 'src/modules/post/services/post.service';

describe('PostService', () => {
    let service: PostService;
    let helperPaginationService: HelperPaginationService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
        },
        post: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockHelperPaginationService = {
        paginate: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: DatabaseService,
                    useValue: mockPrismaService,
                },
                {
                    provide: HelperPaginationService,
                    useValue: mockHelperPaginationService,
                },
            ],
        }).compile();

        service = module.get<PostService>(PostService);
        helperPaginationService = module.get<HelperPaginationService>(
            HelperPaginationService
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createPostDto: PostCreateDto = {
            title: 'Test Post',
            content: 'Test Content',
            images: ['image1.jpg', 'image2.jpg'],
        };

        it('should create a post successfully', async () => {
            const userId = 'user-123';
            const mockUser = { id: userId };
            const mockCreatedPost = {
                id: 'post-123',
                ...createPostDto,
                author: mockUser,
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.post.create.mockResolvedValue(mockCreatedPost);

            const result = await service.create(userId, createPostDto);

            expect(result).toEqual(mockCreatedPost);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
            });
            expect(mockPrismaService.post.create).toHaveBeenCalledWith({
                data: {
                    content: createPostDto.content,
                    title: createPostDto.title,
                    images: {
                        create: createPostDto.images.map(key => ({ key })),
                    },
                    author: {
                        connect: { id: userId },
                    },
                },
                include: {
                    author: true,
                    images: true,
                },
            });
        });

        it('should throw an error if user is not found', async () => {
            const userId = 'non-existent-user';
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.create(userId, createPostDto)).rejects.toThrow(
                new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                )
            );
        });

        it('should handle database errors', async () => {
            const userId = 'user-123';
            mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
            mockPrismaService.post.create.mockRejectedValue(
                new Error('Database error')
            );

            await expect(service.create(userId, createPostDto)).rejects.toThrow(
                'Database error'
            );
        });
    });

    describe('delete', () => {
        const postId = 'post-123';
        const userId = 'user-123';

        it('should delete a post successfully', async () => {
            const mockPost = { id: postId, authorId: userId };
            mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
            mockPrismaService.post.update.mockResolvedValue({
                ...mockPost,
                deletedAt: new Date(),
            });

            const result = await service.delete(userId, postId);

            expect(result).toEqual({
                success: true,
                message: 'post.success.postDeleted',
            });
            expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
                where: { id: postId },
                select: { authorId: true },
            });
            expect(mockPrismaService.post.update).toHaveBeenCalledWith({
                where: { id: postId },
                data: { deletedAt: expect.any(Date) },
            });
        });

        it('should throw an error if post is not found', async () => {
            mockPrismaService.post.findUnique.mockResolvedValue(null);

            await expect(service.delete(userId, postId)).rejects.toThrow(
                new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                )
            );
        });

        it('should throw an error if user is not the author', async () => {
            const mockPost = { id: postId, authorId: 'different-user' };
            mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

            await expect(service.delete(userId, postId)).rejects.toThrow(
                new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                )
            );
        });
    });

    describe('getAll', () => {
        const getPostsDto: PostGetDto = {
            limit: 10,
            page: 1,
            search: 'test',
        };

        it('should return paginated posts with search', async () => {
            const mockPaginatedResult = {
                metadata: {
                    totalItems: 1,
                    itemsPerPage: 10,
                    totalPages: 1,
                    currentPage: 1,
                },
                items: [{ id: 'post-1', title: 'Test Post' }],
            };

            mockHelperPaginationService.paginate.mockResolvedValue(
                mockPaginatedResult
            );

            const result = await service.getAll(getPostsDto);

            expect(result).toEqual(mockPaginatedResult);
            expect(helperPaginationService.paginate).toHaveBeenCalledWith(
                mockPrismaService.post,
                { limit: getPostsDto.limit, page: getPostsDto.page },
                {
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: getPostsDto.search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                content: {
                                    contains: getPostsDto.search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                    include: {
                        author: true,
                        images: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            );
        });

        it('should return paginated posts without search', async () => {
            const getPostsDtoNoSearch: PostGetDto = { limit: 10, page: 1 };
            const mockPaginatedResult = {
                metadata: {
                    totalItems: 1,
                    itemsPerPage: 10,
                    totalPages: 1,
                    currentPage: 1,
                },
                items: [{ id: 'post-1', title: 'Test Post' }],
            };

            mockHelperPaginationService.paginate.mockResolvedValue(
                mockPaginatedResult
            );

            const result = await service.getAll(getPostsDtoNoSearch);

            expect(result).toEqual(mockPaginatedResult);
            expect(helperPaginationService.paginate).toHaveBeenCalledWith(
                mockPrismaService.post,
                {
                    limit: getPostsDtoNoSearch.limit,
                    page: getPostsDtoNoSearch.page,
                },
                {
                    where: {},
                    include: {
                        author: true,
                        images: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            );
        });
    });

    describe('update', () => {
        const postId = 'post-123';
        const userId = 'user-123';
        const updatePostDto: PostUpdateDto = {
            title: 'Updated Title',
            content: 'Updated Content',
            images: ['newimage.jpg'],
        };

        it('should update a post successfully', async () => {
            const mockPost = {
                id: postId,
                authorId: userId,
                images: [{ key: 'oldimage.jpg' }],
            };
            const updatedPost = { ...mockPost, ...updatePostDto };

            mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
            mockPrismaService.post.update.mockResolvedValue(updatedPost);

            const result = await service.update(userId, postId, updatePostDto);

            expect(result).toEqual(updatedPost);
            expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
                where: { id: postId },
                include: { images: true },
            });
            expect(mockPrismaService.post.update).toHaveBeenCalledWith({
                where: { id: postId },
                data: {
                    title: updatePostDto.title,
                    content: updatePostDto.content,
                    images: {
                        deleteMany: { key: { in: ['oldimage.jpg'] } },
                        create: [{ key: 'newimage.jpg' }],
                    },
                },
                include: {
                    author: true,
                    images: true,
                },
            });
        });

        it('should throw an error if post is not found', async () => {
            mockPrismaService.post.findUnique.mockResolvedValue(null);

            await expect(
                service.update(userId, postId, updatePostDto)
            ).rejects.toThrow(
                new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                )
            );
        });

        it('should throw an error if user is not the author', async () => {
            const mockPost = {
                id: postId,
                authorId: 'different-user',
                images: [],
            };
            mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

            await expect(
                service.update(userId, postId, updatePostDto)
            ).rejects.toThrow(
                new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                )
            );
        });

        it('should handle database errors', async () => {
            mockPrismaService.post.findUnique.mockRejectedValue(
                new Error('Database error')
            );

            await expect(
                service.update(userId, postId, updatePostDto)
            ).rejects.toThrow('Database error');
        });
    });
});
