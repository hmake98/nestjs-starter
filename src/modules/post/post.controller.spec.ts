import { Test } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';

import { AppModule } from '../../app/app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post, User } from '../../common/database/entities';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;
  let connection: DataSource;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User, Post])],
      controllers: [PostController],
      providers: [PostService],
    }).compile();

    connection = await moduleRef.get(getDataSourceToken());
    postService = moduleRef.get<PostService>(PostService);
    postController = moduleRef.get<PostController>(PostController);
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it('controller to be defined', () => {
    expect(postController).toBeDefined();
  });

  it('service to be defined', () => {
    expect(postService).toBeDefined();
  });
});
