import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { DatabaseService } from 'src/common/database/services/database.service';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import { PostCreateDto } from '../dtos/request/post.create.request';
import { PostGetDto } from '../dtos/request/post.get.request';
import { PostUpdateDto } from '../dtos/request/post.update.request';
import {
    PostCreateResponseDto,
    PostResponseDto,
    PostUpdateResponseDto,
} from '../dtos/response/post.response';
import { IPostService } from '../interfaces/post.service.interface';

@Injectable()
export class PostService implements IPostService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly helperPaginationService: HelperPaginationService
    ) {}

    async create(
        userId: string,
        data: PostCreateDto
    ): Promise<PostCreateResponseDto> {
        const { content, title, images } = data;

        try {
            const user = await this.databaseService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            return await this.databaseService.post.create({
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
            const post = await this.databaseService.post.findUnique({
                where: { id },
                select: { authorId: true },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            if (post.authorId !== userId) {
                throw new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                );
            }

            await this.databaseService.post.update({
                where: { id },
                data: { deletedAt: new Date() },
            });

            return {
                success: true,
                message: 'post.success.postDeleted',
            };
        } catch (error) {
            throw error;
        }
    }

    async getAll(
        params: PostGetDto
    ): Promise<ApiPaginatedDataDto<PostResponseDto>> {
        const { search, ...paginationParams } = params;

        const whereClause = search
            ? {
                  OR: [
                      {
                          title: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },
                      {
                          content: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },
                  ],
              }
            : {};

        return this.helperPaginationService.paginate(
            this.databaseService.post,
            paginationParams,
            {
                where: whereClause,
                include: {
                    author: true,
                    images: true,
                },
                orderBy: { createdAt: 'desc' },
            }
        );
    }

    async update(
        userId: string,
        id: string,
        data: PostUpdateDto
    ): Promise<PostUpdateResponseDto> {
        const { content, title, images } = data;

        try {
            const post = await this.databaseService.post.findUnique({
                where: { id },
                include: { images: true },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            if (post.authorId !== userId) {
                throw new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                );
            }

            const currentImages = post.images.map(image => image.key);
            const imagesToDelete = currentImages.filter(
                image => !images?.includes(image)
            );
            const imagesToAdd = images?.filter(
                image => !currentImages.includes(image)
            );

            return await this.databaseService.post.update({
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
