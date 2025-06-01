import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { DocGenericResponse } from 'src/common/doc/decorators/doc.generic.decorator';
import { DocPaginatedResponse } from 'src/common/doc/decorators/doc.paginated.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';
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
import { PostService } from '../services/post.service';

@ApiTags('public.post')
@Controller({
    path: '/post',
    version: '1',
})
export class PostPublicController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Create a new post' })
    @DocResponse({
        serialization: PostCreateResponseDto,
        httpStatus: HttpStatus.CREATED,
        messageKey: 'post.success.created',
    })
    public async createPost(
        @AuthUser() { userId }: IAuthUser,
        @Body() payload: PostCreateDto
    ): Promise<PostCreateResponseDto> {
        return this.postService.create(userId, payload);
    }

    @Delete(':id')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Delete a post' })
    @ApiParam({ name: 'id', description: 'Post ID' })
    @DocGenericResponse({
        httpStatus: HttpStatus.OK,
        messageKey: 'post.success.deleted',
    })
    public async deletePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string
    ): Promise<ApiGenericResponseDto> {
        return this.postService.delete(userId, postId);
    }

    @Get()
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Get all posts' })
    @DocPaginatedResponse({
        serialization: PostResponseDto,
        messageKey: 'post.success.fetched',
        httpStatus: HttpStatus.OK,
    })
    public async getPosts(
        @Query() params: PostGetDto
    ): Promise<ApiPaginatedDataDto<PostResponseDto>> {
        return this.postService.getAll(params);
    }

    @Put(':id')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Update a post' })
    @ApiParam({ name: 'id', description: 'Post ID' })
    @DocResponse({
        serialization: PostUpdateResponseDto,
        messageKey: 'post.success.updated',
        httpStatus: HttpStatus.OK,
    })
    public async updatePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string,
        @Body() payload: PostUpdateDto
    ): Promise<PostUpdateResponseDto> {
        return this.postService.update(userId, postId, payload);
    }
}
