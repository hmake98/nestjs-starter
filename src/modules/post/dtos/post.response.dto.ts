import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Post, PostImages } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { IGetResponse } from 'src/core/interfaces/response.interface';
import { UserResponseDto } from 'src/modules/user/dtos/user.response.dto';

export class PostImagesResponseDto implements PostImages {
  @ApiProperty()
  id: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  is_deleted: boolean;

  @ApiHideProperty()
  @Exclude()
  post_id: string;
}

export class PostResponseDto implements Post {
  @ApiProperty()
  author_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  title: string;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  @Type(() => UserResponseDto)
  @ValidateNested()
  author: UserResponseDto;

  @ApiProperty()
  @Type(() => PostImagesResponseDto)
  @ValidateNested()
  images: PostImagesResponseDto[];
}

export class CreatePostResponseDto extends PostResponseDto {}

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
  @Type(() => PostResponseDto)
  @ValidateNested()
  data: PostResponseDto[];
}
export class UpdatePostResponseDto extends PostResponseDto {}
