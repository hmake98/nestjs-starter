import { Injectable } from '@nestjs/common';
import { Posts, User } from 'src/database/entities';
import { PostRepository } from '../../shared/repository';
import { PostCreateDto } from './dto/post-create.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepo: PostRepository) {}

  public async createPost(data: PostCreateDto, authUser: User): Promise<Posts> {
    const { content } = data;
    const newPost = new Posts();
    newPost.content = content.trim();
    newPost.author = authUser;
    return await this.postRepo.save(newPost);
  }
}
