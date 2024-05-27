import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { PostService } from '../../src/modules/post/services/post.service';
import { PrismaService } from '../../src/common/helper/services/prisma.service';
import { CreatePostDto } from '../../src/modules/post/dtos/create.post.dto';

describe('PostService', () => {
  let postService: PostService;

  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
    },
    post: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const userId = 'user-id';
      const postData: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
      };

      prismaServiceMock.user.findUnique.mockResolvedValueOnce({ id: userId });
      prismaServiceMock.post.create.mockResolvedValueOnce(postData);

      const result = await postService.create(userId, postData);

      expect(result).toEqual(postData);
    });

    it('should throw 404 error if user not found', async () => {
      const userId = 'user-id';
      const postData: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
      };

      prismaServiceMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(postService.create(userId, postData)).rejects.toThrow(
        new HttpException('users.userNotFound', HttpStatus.NOT_FOUND),
      );
    });
  });
});
