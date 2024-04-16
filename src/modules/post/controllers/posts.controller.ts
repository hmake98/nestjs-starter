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
import { PostService } from '../services/post.service';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { CreatePostDto } from '../dtos/create.post.dto';
import { GetPostsDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreatePostResponseDto,
  DeletePostResponseDto,
  GetPostsResponseDto,
  UpdatePostResponseDto,
} from '../dtos/post.response.dto';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';

@ApiTags('posts')
@Controller({
  version: '1',
  path: '/posts',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: CreatePostResponseDto,
    httpStatus: 201,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Post()
  public async createPost(
    @AuthUser() userId: string,
    @Body() payload: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    return this.postService.create(userId, payload);
  }

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: DeletePostResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Delete(':id')
  public async deletePost(
    @Param('id') postId: string,
  ): Promise<DeletePostResponseDto> {
    return this.postService.delete(postId);
  }

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: GetPostsResponseDto,
    httpStatus: 200,
  })
  @Get()
  public async getPosts(
    @Query() params: GetPostsDto,
  ): Promise<GetPostsResponseDto> {
    return this.postService.getAll(params);
  }

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: UpdatePostResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Put(':id')
  public async updatePost(
    @Param('id') postId: string,
    @Body() payload: UpdatePostDto,
  ): Promise<UpdatePostResponseDto> {
    return this.postService.update(postId, payload);
  }
}
