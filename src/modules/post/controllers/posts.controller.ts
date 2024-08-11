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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import {
  DocErrors,
  DocGenericResponse,
  DocPaginatedResponse,
  DocResponse,
} from 'src/core/decorators/response.decorator';
import { ApiGenericResponseDto, ApiPaginatedDataDto } from 'src/core/dtos/response.dto';
import { IAuthUser } from 'src/core/interfaces/request.interface';

import { CreatePostDto } from '../dtos/create.post.dto';
import { GetPostsDto } from '../dtos/get.post.dto';
import {
  CreatePostResponseDto,
  PostResponseDto,
  UpdatePostResponseDto,
} from '../dtos/post.response.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { PostService } from '../services/post.service';

@ApiTags('posts')
@Controller({
  version: '1',
  path: 'posts',
})
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('accessToken')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @DocResponse({
    serialization: CreatePostResponseDto,
    httpStatus: HttpStatus.CREATED,
  })
  @DocErrors([HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED])
  public async createPost(
    @AuthUser() user: IAuthUser,
    @Body() payload: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    return this.postService.create(user.userId, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @DocGenericResponse()
  @DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
  public async deletePost(
    @AuthUser() { userId }: IAuthUser,
    @Param('id') postId: string,
  ): Promise<ApiGenericResponseDto> {
    return this.postService.delete(userId, postId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @DocPaginatedResponse({
    serialization: PostResponseDto,
    httpStatus: HttpStatus.OK,
  })
  @DocErrors([HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED])
  public async getPosts(
    @Query() params: GetPostsDto,
  ): Promise<ApiPaginatedDataDto<PostResponseDto>> {
    return this.postService.getAll(params);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @DocResponse({
    serialization: UpdatePostResponseDto,
    httpStatus: HttpStatus.OK,
  })
  @DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
  public async updatePost(
    @AuthUser() { userId }: IAuthUser,
    @Param('id') postId: string,
    @Body() payload: UpdatePostDto,
  ): Promise<UpdatePostResponseDto> {
    return this.postService.update(userId, postId, payload);
  }
}
