import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, User } from '../../database/entities';
import { ILike, Repository } from 'typeorm';
import { CreatePostDto, GetPostsDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async create(userId: number, data: CreatePostDto) {
    const { content } = data;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
    }
    const post = new Post();
    post.content = content.trim();
    post.author = user;
    return this.postRepository.save(post);
  }

  public async delete(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
    }
    const result = await this.postRepository.delete({ id });
    return result.raw;
  }

  public async getAll(params: GetPostsDto) {
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
  }

  public async update(id: number, data: UpdatePostDto) {
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
  }
}
