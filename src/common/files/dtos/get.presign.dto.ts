import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { FileStoreType } from '../constants/files.enum';

export class GetPresignDto {
  @ApiProperty({
    description: 'file name',
    example: faker.system.commonFileName(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'file name is required.' })
  fileName: string;

  @ApiProperty({
    description: 'file store type',
    example: FileStoreType.UserProfiles,
    required: true,
    enum: FileStoreType,
  })
  @IsEnum(FileStoreType, {
    message: 'store type should be enum value',
  })
  @IsNotEmpty({ message: 'store type is required.' })
  storeType: FileStoreType;

  @ApiProperty({
    description: 'content type',
    example: faker.system.mimeType(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'content type is required.' })
  contentType: string;
}
