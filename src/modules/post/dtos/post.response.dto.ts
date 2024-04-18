import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Files, Posts, Users } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IGetResponse } from 'src/core/interfaces/response.interface';

export class UserDto implements Users {
  avatar_id: string;
  created_at: Date;
  deleted_at: Date;
  email: string;
  first_name: string;
  id: string;
  is_deleted: boolean;
  is_verified: boolean;
  last_name: string;
  phone: string;
  role: $Enums.Roles;
  updated_at: Date;

  @Exclude()
  password: string;
}

export class FileDto implements Files {
  created_at: Date;
  deleted_at: Date;
  file_name: string;
  id: string;
  is_deleted: boolean;
  link: string;
  post_id: string;
  type: string;
  updated_at: Date;
}

export class PostResponseDto implements Posts {
  author_id: string;
  content: string;
  created_at: Date;
  deleted_at: Date;
  id: string;
  is_deleted: boolean;
  title: string;
  updated_at: Date;
  author: UserDto;
  photos: FileDto[];
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
  @Expose()
  data: PostResponseDto[];
}
export class UpdatePostResponseDto extends PostResponseDto {}
