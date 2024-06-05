import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { GenericResponseDto } from 'src/core/dtos/response.dto';

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

@Injectable()
export class PostService implements IPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: string,
    data: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    try {
      const { content, title, images } = data;
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('users.userNotFound', HttpStatus.NOT_FOUND);
      }
      return this.prismaService.post.create({
        data: {
          content,
          title,
          images: {
            create: images.map((key) => ({
              image: key,
            })),
          },
          author: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string): Promise<GenericResponseDto> {
    try {
      const post = await this.prismaService.post.findUnique({ where: { id } });
      if (!post) {
        throw new HttpException('posts.postNotFound', HttpStatus.NOT_FOUND);
      }
      await this.prismaService.post.update({
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
      const count = await this.prismaService.post.count({
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
      const data = await this.prismaService.post.findMany({
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
          images: true,
        },
      });
      return {
        count,
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: string,
    data: UpdatePostDto,
  ): Promise<UpdatePostResponseDto> {
    try {
      const { content, title, images } = data;

      const post = await this.prismaService.post.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!post) {
        throw new HttpException('posts.postNotFound', HttpStatus.NOT_FOUND);
      }
      const currentImages = post.images.map((image) => image.image);

      const imagesToDelete = currentImages.filter(
        (image) => !images.includes(image),
      );
      const imagesToAdd = images.filter(
        (image) => !currentImages.includes(image),
      );
      return this.prismaService.post.update({
        where: { id },
        data: {
          title,
          content,
          images: {
            deleteMany: {
              image: { in: imagesToDelete },
            },
            create: imagesToAdd.map((key) => ({
              image: key,
            })),
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
