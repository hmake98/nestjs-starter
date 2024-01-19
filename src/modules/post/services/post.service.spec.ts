import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create.post.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { PostService } from './post.service';

describe('PostService', () => {
  let postService: PostService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PrismaService],
    }).compile();

    postService = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a post', async () => {
      const userId = 'user123';
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
      };

      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValue({ id: userId });
      prismaService.post.create = jest.fn().mockResolvedValue(createPostDto);

      const result = await postService.create(userId, createPostDto);

      expect(result).toEqual(createPostDto);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          content: createPostDto.content,
          title: createPostDto.title,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
    });

    it('should throw HttpException if user is not found', async () => {
      const userId = 'user123';
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
      };

      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValue({ id: userId });

      await expect(
        postService.create(userId, createPostDto),
      ).rejects.toThrowError(
        new HttpException('userNotFound', HttpStatus.NOT_FOUND),
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.post.create).not.toHaveBeenCalled();
    });
  });
});
