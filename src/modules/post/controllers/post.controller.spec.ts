import { Test } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from '../services/post.service';

import { PostModule } from '../post.module';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostModule],
      controllers: [PostController],
      providers: [PostService],
    }).compile();

    postService = moduleRef.get<PostService>(PostService);
    postController = moduleRef.get<PostController>(PostController);
  });

  it('controller to be defined', () => {
    expect(postController).toBeDefined();
  });

  it('service to be defined', () => {
    expect(postService).toBeDefined();
  });
});
