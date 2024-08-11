import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { CreatePostDto } from 'src/modules/post/dtos/create.post.dto';
import { GetPostsDto } from 'src/modules/post/dtos/get.post.dto';
import { UpdatePostDto } from 'src/modules/post/dtos/update.post.dto';
import { PostService } from 'src/modules/post/services/post.service';

describe('PostService', () => {
  let service: PostService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    post: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'Test Content',
      images: ['image1.jpg', 'image2.jpg'],
    };

    it('should create a post successfully', async () => {
      const userId = 'user-123';
      const mockUser = { id: userId };
      const mockCreatedPost = { id: 'post-123', ...createPostDto, author: mockUser };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.post.create.mockResolvedValue(mockCreatedPost);

      const result = await service.create(userId, createPostDto);

      expect(result).toEqual(mockCreatedPost);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
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
        new HttpException('users.errors.userNotFound', HttpStatus.NOT_FOUND),
      );
    });

    it('should catch and rethrow errors during post creation', async () => {
      const userId = 'user-123';
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
        images: ['image1.jpg', 'image2.jpg'],
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
      mockPrismaService.post.create.mockRejectedValue(new Error('Database error during creation'));

      await expect(service.create(userId, createPostDto)).rejects.toThrow(
        'Database error during creation',
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockPrismaService.post.create).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const userId = 'user-123';
      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
      mockPrismaService.post.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(userId, createPostDto)).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    const postId = 'post-123';
    const userId = 'user-123';

    it('should delete a post successfully', async () => {
      const mockPost = { id: postId, authorId: userId };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue({ ...mockPost, deletedAt: new Date() });

      const result = await service.delete(userId, postId);

      expect(result).toEqual({
        success: true,
        message: 'posts.success.postDeleted',
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
        new HttpException('posts.errors.postNotFound', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if user is not the author', async () => {
      const mockPost = { id: postId, authorId: 'different-user' };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      await expect(service.delete(userId, postId)).rejects.toThrow(
        new HttpException('auth.errors.insufficientPermissions', HttpStatus.FORBIDDEN),
      );
    });

    it('should handle database errors', async () => {
      mockPrismaService.post.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.delete(userId, postId)).rejects.toThrow('Database error');
    });
  });

  describe('getAll', () => {
    const getPostsDto: GetPostsDto = {
      limit: 10,
      page: 1,
      search: 'test',
    };

    it('should return paginated posts with search', async () => {
      const mockPosts = [{ id: 'post-1', title: 'Test Post' }];
      const mockCount = 1;

      mockPrismaService.post.count.mockResolvedValue(mockCount);
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.getAll(getPostsDto);

      expect(result).toEqual({
        metadata: {
          totalItems: mockCount,
          itemsPerPage: getPostsDto.limit,
          totalPages: 1,
          currentPage: getPostsDto.page,
        },
        items: mockPosts,
      });

      const expectedWhereClause = {
        OR: [
          { title: { contains: getPostsDto.search, mode: 'insensitive' } },
          { content: { contains: getPostsDto.search, mode: 'insensitive' } },
        ],
      };

      expect(mockPrismaService.post.count).toHaveBeenCalledWith({ where: expectedWhereClause });
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        take: getPostsDto.limit,
        skip: 0,
        include: { author: true, images: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return paginated posts without search', async () => {
      const getPostsDtoNoSearch: GetPostsDto = { limit: 10, page: 1 };
      const mockPosts = [{ id: 'post-1', title: 'Test Post' }];
      const mockCount = 1;

      mockPrismaService.post.count.mockResolvedValue(mockCount);
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.getAll(getPostsDtoNoSearch);

      expect(result).toEqual({
        metadata: {
          totalItems: mockCount,
          itemsPerPage: getPostsDtoNoSearch.limit,
          totalPages: 1,
          currentPage: getPostsDtoNoSearch.page,
        },
        items: mockPosts,
      });

      expect(mockPrismaService.post.count).toHaveBeenCalledWith({ where: {} });
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: {},
        take: getPostsDtoNoSearch.limit,
        skip: 0,
        include: { author: true, images: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle database errors', async () => {
      mockPrismaService.post.count.mockRejectedValue(new Error('Database error'));

      await expect(service.getAll(getPostsDto)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    const postId = 'post-123';
    const userId = 'user-123';
    const updatePostDto: UpdatePostDto = {
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

      await expect(service.update(userId, postId, updatePostDto)).rejects.toThrow(
        new HttpException('posts.errors.postNotFound', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if user is not the author', async () => {
      const mockPost = { id: postId, authorId: 'different-user', images: [] };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      await expect(service.update(userId, postId, updatePostDto)).rejects.toThrow(
        new HttpException('auth.errors.insufficientPermissions', HttpStatus.FORBIDDEN),
      );
    });

    it('should handle database errors', async () => {
      mockPrismaService.post.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.update(userId, postId, updatePostDto)).rejects.toThrow('Database error');
    });

    it('should catch and rethrow errors during post update', async () => {
      const postId = 'post-123';
      const userId = 'user-123';
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        images: ['newimage.jpg'],
      };

      const mockPost = {
        id: postId,
        authorId: userId,
        images: [{ key: 'oldimage.jpg' }],
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockRejectedValue(new Error('Database error during update'));

      await expect(service.update(userId, postId, updatePostDto)).rejects.toThrow(
        'Database error during update',
      );

      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        include: { images: true },
      });
      expect(mockPrismaService.post.update).toHaveBeenCalled();
    });
  });
});
