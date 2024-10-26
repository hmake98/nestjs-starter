import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import {
    PostPublicCreateDoc,
    PostPublicDeleteDoc,
    PostPublicGetAllDoc,
    PostPublicUpdateDoc,
} from '../docs/post.public.doc';
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

    @PostPublicCreateDoc()
    @Post()
    public async createPost(
        @AuthUser() { userId }: IAuthUser,
        @Body() payload: PostCreateDto
    ): Promise<PostCreateResponseDto> {
        return this.postService.create(userId, payload);
    }

    @PostPublicDeleteDoc()
    @Delete(':id')
    public async deletePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string
    ): Promise<ApiGenericResponseDto> {
        return this.postService.delete(userId, postId);
    }

    @PostPublicGetAllDoc()
    @Get()
    public async getPosts(
        @Query() params: PostGetDto
    ): Promise<ApiPaginatedDataDto<PostResponseDto>> {
        return this.postService.getAll(params);
    }

    @PostPublicUpdateDoc()
    @Put(':id')
    public async updatePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string,
        @Body() payload: PostUpdateDto
    ): Promise<PostUpdateResponseDto> {
        return this.postService.update(userId, postId, payload);
    }
}
