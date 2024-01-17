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
import { PostService } from '../services/post.service';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { CreatePostDto } from '../dtos/create-post.dto';
import { GetPostsDto } from '../dtos/get-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  public async createPost(
    @AuthUser() userId: number,
    @Body() payload: CreatePostDto,
  ) {
    return this.postService.create(userId, payload);
  }

  @Delete(':id')
  public async deletePost(@Param() id: number) {
    return this.postService.delete(id);
  }

  @Get()
  public async getPosts(@Query() params: GetPostsDto) {
    return this.postService.getAll(params);
  }

  @Put(':id')
  public async updatePost(@Param() id: number, @Body() payload: UpdatePostDto) {
    return this.postService.update(id, payload);
  }
}
