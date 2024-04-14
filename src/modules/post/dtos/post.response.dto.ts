import { ApiProperty } from '@nestjs/swagger';
import { Posts } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IGetResponse } from 'src/core/interfaces/response.interface';

export class PostResponseDto implements Posts {
  author_id: string;
  content: string;
  created_at: Date;
  deleted_at: Date;
  id: string;
  is_deleted: boolean;
  title: string;
  updated_at: Date;
}

export class CreatePostResponseDto extends PostResponseDto {}
export class DeletePostResponseDto extends PostResponseDto {}
export class GetPostsResponseDto implements IGetResponse<PostResponseDto> {
  @ApiProperty({
    example: 10,
    required: true,
    nullable: false,
  })
  @Expose()
  count: number;

  @ApiProperty({
    example: PostResponseDto,
    required: true,
  })
  @Expose()
  data: PostResponseDto[];
}
export class UpdatePostResponseDto extends PostResponseDto {}
