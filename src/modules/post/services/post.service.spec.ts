import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create.post.dto';

describe('PostService', () => {
  let postService: PostService;

  const prismaServiceMock = {
    users: {
      findUnique: jest.fn(),
    },
    posts: {
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

  beforeAll(done => {
    done();
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

      prismaServiceMock.users.findUnique.mockResolvedValueOnce({ id: userId });
      prismaServiceMock.posts.create.mockResolvedValueOnce(postData);

      const result = await postService.create(userId, postData);

      expect(result).toEqual(postData);
    });

    it('should throw 404 error if user not found', async () => {
      const userId = 'user-id';
      const postData: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
      };

      prismaServiceMock.users.findUnique.mockResolvedValueOnce(null);

      await expect(postService.create(userId, postData)).rejects.toThrowError(
        new HttpException('users.userNotFound', HttpStatus.NOT_FOUND),
      );
    });
  });
});
