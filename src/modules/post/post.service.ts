import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreatePostDto, GetPostsDto, UpdatePostDto } from './dto';
import { Post, User } from '../../common/database/entities';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async create(userId: number, data: CreatePostDto) {
    try {
      const { content } = data;
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      const post = new Post();
      post.content = content.trim();
      post.author = user;
      return this.postRepository.save(post);
    } catch (e) {
      throw new Error(e);
    }
  }

  public async delete(id: number) {
    try {
      const post = await this.postRepository.findOneBy({ id });
      if (!post) {
        throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
      }
      const result = await this.postRepository.delete({ id });
      return result.raw;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getAll(params: GetPostsDto) {
    try {
      const { limit, page, search } = params;
      const skip = (page - 1) * limit;
      const [result, total] = await this.postRepository.findAndCount({
        where: { content: ILike('%' + search + '%') },
        order: { created_at: 'DESC' },
        take: limit,
        skip: skip,
      });
      return {
        count: total,
        data: result,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async update(id: number, data: UpdatePostDto) {
    try {
      const { content } = data;
      const post = await this.postRepository.findOneBy({ id });
      if (!post) {
        throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
      }
      const result = await this.postRepository.update(
        {
          id,
        },
        {
          content,
        },
      );
      return result.raw;
    } catch (e) {
      throw new Error(e);
    }
  }
}
