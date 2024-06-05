import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Post, User } from '@prisma/client';

import { GenericResponseDto } from 'src/core/dtos/response.dto';
import { PostService } from 'src/modules/post/services/post.service';
import { PrismaService } from 'src/common/helper/services/prisma.service';
import { CreatePostDto } from 'src/modules/post/dtos/create.post.dto';
import {
  CreatePostResponseDto,
  GetPostsResponseDto,
  UpdatePostResponseDto,
} from 'src/modules/post/dtos/post.response.dto';
import { GetPostsDto } from 'src/modules/post/dtos/get.post.dto';
import { UpdatePostDto } from 'src/modules/post/dtos/update.post.dto';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const userId = 'user1';
      const data = {
        content: 'Test Content',
        title: 'Test Title',
        images: ['image1', 'image2'],
      } as unknown as CreatePostDto;
      const user = { id: userId } as User;
      const expectedResult = {
        id: 'post1',
        content: 'Test Content',
        title: 'Test Title',
        author: user,
        images: [{ image: 'image1' }, { image: 'image2' }],
      } as unknown as CreatePostResponseDto;

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest
        .spyOn(prismaService.post, 'create')
        .mockResolvedValue(expectedResult);

      const result = await service.create(userId, data);
      expect(result).toEqual(expectedResult);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          content: data.content,
          title: data.title,
          images: {
            create: data.images.map((key) => ({ image: key })),
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

    it('should throw an exception if user not found', async () => {
      const userId = 'user1';
      const data: CreatePostDto = {
        content: 'Test Content',
        title: 'Test Title',
        images: ['image1', 'image2'],
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.create(userId, data)).rejects.toThrow(
        new HttpException('users.userNotFound', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const postId = 'post1';
      const post = { id: postId } as Post;
      const expectedResult: GenericResponseDto = {
        status: true,
        message: 'posts.postDeleted',
      };

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(post);
      jest.spyOn(prismaService.post, 'update').mockResolvedValue(undefined);

      const result = await service.delete(postId);
      expect(result).toEqual(expectedResult);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: { deleted_at: expect.any(Date), is_deleted: true },
      });
    });

    it('should throw an exception if post not found', async () => {
      const postId = 'post1';

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.delete(postId)).rejects.toThrow(
        new HttpException('posts.postNotFound', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getAll', () => {
    it('should return a list of posts', async () => {
      const params = {
        limit: 10,
        page: 1,
        search: 'Test',
      } as unknown as GetPostsDto;
      const expectedResult = {
        count: 1,
        data: [
          {
            id: 'post1',
            content: 'Test Content',
            title: 'Test Title',
            author: { id: 'user1' },
            images: [{ image: 'image1' }, { image: 'image2' }],
          },
        ],
      } as unknown as GetPostsResponseDto;

      jest.spyOn(prismaService.post, 'count').mockResolvedValue(1);
      jest
        .spyOn(prismaService.post, 'findMany')
        .mockResolvedValue(expectedResult.data);

      const result = await service.getAll(params);
      expect(result).toEqual(expectedResult);
      expect(prismaService.post.count).toHaveBeenCalledWith({
        where: {
          title: { contains: params.search, mode: 'insensitive' },
          content: { contains: params.search, mode: 'insensitive' },
          is_deleted: false,
        },
      });
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          title: { contains: params.search, mode: 'insensitive' },
          content: { contains: params.search, mode: 'insensitive' },
          is_deleted: false,
        },
        take: params.limit,
        skip: (params.page - 1) * params.limit,
        include: {
          author: true,
          images: true,
        },
      });
    });

    it('should throw an HttpException when an error occurs', async () => {
      const params: GetPostsDto = {
        limit: 10,
        page: 1,
        search: 'Test',
      };

      jest.spyOn(prismaService.post, 'count').mockRejectedValue(new Error());

      await expect(service.getAll(params)).rejects.toThrow(expect.any(Error));
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postId = 'post1';
      const data = {
        content: 'Updated Content',
        title: 'Updated Title',
        images: ['image1', 'image3'],
      } as UpdatePostDto;
      const post = {
        id: postId,
        content: 'Old Content',
        title: 'Old Title',
        images: [{ image: 'image1' }, { image: 'image2' }],
      } as unknown as Post;
      const expectedResult = {
        id: postId,
        content: 'Updated Content',
        title: 'Updated Title',
        author: { id: 'user1' },
        images: [{ image: 'image1' }, { image: 'image3' }],
      } as unknown as UpdatePostResponseDto;

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(post);
      jest
        .spyOn(prismaService.post, 'update')
        .mockResolvedValue(expectedResult);

      const result = await service.update(postId, data);
      expect(result).toEqual(expectedResult);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        include: { images: true },
      });
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: {
          title: data.title,
          content: data.content,
          images: {
            deleteMany: {
              image: { in: ['image2'] },
            },
            create: [{ image: 'image3' }],
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
    });

    it('should throw an exception if post not found', async () => {
      const postId = 'post1';
      const data: UpdatePostDto = {
        content: 'Updated Content',
        title: 'Updated Title',
        images: ['image1', 'image3'],
      };

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.update(postId, data)).rejects.toThrow(
        new HttpException('posts.postNotFound', HttpStatus.NOT_FOUND),
      );
    });
  });
});
