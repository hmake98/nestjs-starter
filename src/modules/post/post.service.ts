import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas';
import { Posts, PostDocument } from 'src/database/schemas/post.schema';
import { PostCreateDto } from './dto/post-create.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Posts.name) private readonly postModel: Model<PostDocument>) {}

  public async createPost(data: PostCreateDto, authUser: User): Promise<Posts> {
    const { content } = data;
    const newPost = new Posts();
    newPost.content = content.trim();
    newPost.author = authUser;
    return await this.postModel.create(newPost);
  }
}
