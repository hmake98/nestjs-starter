import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create.post.dto';
import { GetPostsDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { IPostService } from '../interfaces/post.service.interface';
import {
  CreatePostResponseDto,
  GetPostsResponseDto,
  UpdatePostResponseDto,
} from '../dtos/post.response.dto';
import { GenericResponseDto } from 'src/core/dtos/response.dto';

@Injectable()
export class PostService implements IPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: string,
    data: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    try {
      const { content, title } = data;
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('users.userNotFound', HttpStatus.NOT_FOUND);
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
        include: {
          author: true,
          photos: true,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string): Promise<GenericResponseDto> {
    try {
      const post = await this.prismaService.posts.findUnique({ where: { id } });
      if (!post) {
        throw new HttpException('posts.postNotFound', HttpStatus.NOT_FOUND);
      }
      await this.prismaService.posts.update({
        where: { id },
        data: { deleted_at: new Date(), is_deleted: true },
      });
      return {
        status: true,
        message: 'posts.postDeleted',
      };
    } catch (e) {
      throw e;
    }
  }

  async getAll(params: GetPostsDto): Promise<GetPostsResponseDto> {
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
          is_deleted: false,
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
          is_deleted: false,
        },
        take: Number(limit),
        skip: Number(skip),
        include: {
          author: true,
          photos: true,
        },
      });
      return {
        count,
        data,
      };
    } catch (e) {
      console.log(e);

      throw e;
    }
  }

  async update(
    id: string,
    data: UpdatePostDto,
  ): Promise<UpdatePostResponseDto> {
    try {
      const { content, title } = data;
      const post = await this.prismaService.posts.findUnique({ where: { id } });
      if (!post) {
        throw new HttpException('posts.postNotFound', HttpStatus.NOT_FOUND);
      }
      return this.prismaService.posts.update({
        where: { id },
        data: {
          title,
          content,
        },
        include: {
          author: true,
          photos: true,
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
