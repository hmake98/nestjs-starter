import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { $Enums, Post, PostImage } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { IsDate, IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';

import { UserResponseDto } from 'src/modules/user/dtos/user.response.dto';

export class PostImagesResponseDto implements Partial<PostImage> {
  @ApiProperty({
    description: 'Unique identifier of the image',
    example: faker.string.uuid(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Storage key of the image',
    example: faker.system.filePath(),
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Creation date of the image',
    example: faker.date.past().toISOString(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the image',
    example: faker.date.recent().toISOString(),
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion date of the image',
    required: false,
    nullable: true,
    example: faker.date.future().toISOString(),
  })
  @IsDate()
  deletedAt: Date | null;

  @ApiHideProperty()
  @Exclude()
  postId: string;
}

export class PostResponseDto implements Partial<Post> {
  @ApiProperty({
    enum: $Enums.PostStatus,
    description: 'Current status of the post',
    example: faker.helpers.arrayElement(Object.values($Enums.PostStatus)),
  })
  @IsEnum($Enums.PostStatus)
  status: $Enums.PostStatus;

  @ApiProperty({
    description: 'ID of the post author',
    example: faker.string.uuid(),
  })
  @IsUUID()
  authorId: string;

  @ApiProperty({
    description: 'Content of the post',
    example: faker.lorem.paragraphs(),
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Creation date of the post',
    example: faker.date.past().toISOString(),
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Deletion date of the post',
    required: false,
    nullable: true,
    example: faker.date.future().toISOString(),
  })
  @IsDate()
  @Type(() => Date)
  deletedAt: Date | null;

  @ApiProperty({
    description: 'Unique identifier of the post',
    example: faker.string.uuid(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Title of the post',
    example: faker.lorem.sentence(),
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Last update date of the post',
    example: faker.date.recent().toISOString(),
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: 'Author details',
    type: () => UserResponseDto,
    example: {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  })
  @ValidateNested()
  @Type(() => UserResponseDto)
  author: UserResponseDto;

  @ApiProperty({
    description: 'Images associated with the post',
    type: [PostImagesResponseDto],
    example: [
      {
        id: faker.string.uuid(),
        key: faker.system.filePath(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        deletedAt: null,
      },
      {
        id: faker.string.uuid(),
        key: faker.system.filePath(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        deletedAt: faker.date.future().toISOString(),
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => PostImagesResponseDto)
  images: PostImagesResponseDto[];
}

export class CreatePostResponseDto extends PostResponseDto {}

export class UpdatePostResponseDto extends PostResponseDto {}
