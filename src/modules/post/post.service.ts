import { Injectable } from "@nestjs/common";
import { Posts, User } from "@prisma/client";
import { PrismaService } from "src/shared";
import { PostCreateDto } from "./dto/post-create.dto";

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  public async createPost(data: PostCreateDto, authUser: User): Promise<Posts> {
    const { content, title, photoId } = data;
    return await this.prisma.posts.create({
      data: {
        content: content.trim(),
        title,
        auther: {
          connect: {
            id: authUser.id,
          },
        },
        photos: {
          connect: {
            id: photoId,
          },
        },
      },
    });
  }
}
