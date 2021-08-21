import { Body, ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Posts, Role, User } from 'src/database/entities';
import { Roles } from 'src/decorators';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ClientAuthGuard, RolesGuard } from 'src/guards';
import { PostCreateDto } from './dto/post-create.dto';
import { PostService } from './post.service';

@ApiBearerAuth()
@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Roles(Role.USER)
  @UseGuards(ClientAuthGuard, RolesGuard)
  @Post('/')
  public async addPracticeUser(@Body() data: PostCreateDto, @CurrentUser() authUser: User): Promise<Posts> {
    return this.postService.createPost(data, authUser);
  }
}
