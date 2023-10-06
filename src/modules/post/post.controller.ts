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
import { CreatePostDto, GetPostsDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';
import { AuthUser } from 'src/core/decorators';

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
