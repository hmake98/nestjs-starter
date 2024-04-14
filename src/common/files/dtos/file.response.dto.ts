import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Files } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FileResponseDto implements Files {
  id: string;
  file_name: string;
  link: string;
  type: string;
  post_id: string;
  created_at: Date;
  deleted_at: Date;
  is_deleted: boolean;
  updated_at: Date;
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
