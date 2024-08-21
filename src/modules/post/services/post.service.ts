import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { ApiGenericResponseDto, ApiPaginatedDataDto } from 'src/core/dtos/response.dto';

import { CreatePostDto } from '../dtos/create.post.dto';
import { GetPostsDto } from '../dtos/get.post.dto';
import {
  CreatePostResponseDto,
  PostResponseDto,
  UpdatePostResponseDto,
} from '../dtos/post.response.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { IPostService } from '../interfaces/post.service.interface';

@Injectable()
export class PostService implements IPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, data: CreatePostDto): Promise<CreatePostResponseDto> {
    const { content, title, images } = data;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('users.errors.userNotFound', HttpStatus.NOT_FOUND);
      }

      return await this.prismaService.post.create({
        data: {
          content,
          title,
          images: {
            create: images?.map(key => ({ key })),
          },
          author: {
            connect: { id: userId },
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: string, id: string): Promise<ApiGenericResponseDto> {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!post) {
        throw new HttpException('posts.errors.postNotFound', HttpStatus.NOT_FOUND);
      }

      if (post.authorId !== userId) {
        throw new HttpException('auth.errors.insufficientPermissions', HttpStatus.FORBIDDEN);
      }

      await this.prismaService.post.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return {
        success: true,
        message: 'posts.success.postDeleted',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(params: GetPostsDto): Promise<ApiPaginatedDataDto<PostResponseDto>> {
    const { limit, page, search } = params;
    const skip = (page - 1) * limit;

    try {
      const [count, data] = await Promise.all([
        this.prismaService.post.count({
          where: search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { content: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        }),
        this.prismaService.post.findMany({
          where: search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { content: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          take: limit,
          skip,
          include: {
            author: true,
            images: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        metadata: {
          totalItems: count,
          itemsPerPage: limit,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        },
        items: data,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, id: string, data: UpdatePostDto): Promise<UpdatePostResponseDto> {
    const { content, title, images } = data;

    try {
      const post = await this.prismaService.post.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!post) {
        throw new HttpException('posts.errors.postNotFound', HttpStatus.NOT_FOUND);
      }

      if (post.authorId !== userId) {
        throw new HttpException('auth.errors.insufficientPermissions', HttpStatus.FORBIDDEN);
      }

      const currentImages = post.images.map(image => image.key);
      const imagesToDelete = currentImages.filter(image => !images?.includes(image));
      const imagesToAdd = images?.filter(image => !currentImages.includes(image));

      return await this.prismaService.post.update({
        where: { id },
        data: {
          title,
          content,
          images: {
            deleteMany: { key: { in: imagesToDelete } },
            create: imagesToAdd.map(key => ({ key })),
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
