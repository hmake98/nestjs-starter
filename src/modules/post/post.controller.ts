import { Body, ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Posts, Role, User } from "@prisma/client";
import { Roles } from "src/core/decorators";
import { CurrentUser } from "src/core/decorators/current-user.decorator";
import { PostCreateDto } from "./dto/post-create.dto";
import { PostService } from "./post.service";

@ApiBearerAuth()
@Controller("post")
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Roles(Role.USER)
  @Post("/")
  public async addPost(@Body() data: PostCreateDto, @CurrentUser() authUser: User): Promise<Posts> {
    return this.postService.createPost(data, authUser);
  }
}
