import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class FileResponseDto implements File {
  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  storage_key: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  type: string;

  @ApiProperty()
  updated_at: Date;

  @ApiHideProperty()
  @Exclude()
  post_id: string;
}

export class FileGetPresignResponseDto {
  @ApiProperty({
    example: faker.image.url(),
    required: true,
    nullable: false,
  })
  @Expose()
  url: string;

  @Expose()
  @ApiProperty()
  @Type(() => FileResponseDto)
  @ValidateNested()
  file: FileResponseDto;
}

export class FilePutPresignResponseDto {
  @ApiProperty({
    example: faker.image.url(),
    required: true,
    nullable: false,
  })
  @Expose()
  url: string;

  @ApiProperty({
    example: '1200',
    required: true,
    nullable: false,
  })
  @Expose()
  expiresIn: string;
}
