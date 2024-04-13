import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create.post.dto';
import { GetPostsDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { IPostService } from '../interfaces/post.service.interface';

@Injectable()
export class PostService implements IPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, data: CreatePostDto) {
    try {
      const { content, title } = data;
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      return this.prismaService.posts.create({
        data: {
          content,
          title,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string) {
    try {
      const post = await this.prismaService.posts.findUnique({ where: { id } });
      if (!post) {
        throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
      }
      await this.prismaService.posts.delete({ where: { id } });
      return {
        status: true,
        message: 'Post is deleted',
      };
    } catch (e) {
      throw e;
    }
  }

  async getAll(params: GetPostsDto) {
    try {
      const { limit, page, search } = params;
      const skip = (page - 1) * limit;
      const count = await this.prismaService.posts.count({
        where: {
          ...(search && {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            content: {
              contains: search,
              mode: 'insensitive',
            },
          }),
        },
      });
      const data = await this.prismaService.posts.findMany({
        where: {
          ...(search && {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            content: {
              contains: search,
              mode: 'insensitive',
            },
          }),
        },
        take: limit,
        skip: skip,
      });
      return {
        count,
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, data: UpdatePostDto) {
    try {
      const { content, title } = data;
      const post = await this.prismaService.posts.findUnique({ where: { id } });
      if (!post) {
        throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
      }
      return this.prismaService.posts.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
