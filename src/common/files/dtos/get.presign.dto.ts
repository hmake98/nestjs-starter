import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ENUM_FILE_STORE } from 'src/app/app.constant';

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
    example: ENUM_FILE_STORE.USER_PROFILES,
    required: true,
    enum: ENUM_FILE_STORE,
  })
  @IsEnum(ENUM_FILE_STORE, {
    message: 'store type should be enum value',
  })
  @IsNotEmpty({ message: 'store type is required.' })
  storeType: ENUM_FILE_STORE;

  @ApiProperty({
    description: 'content type',
    example: faker.system.mimeType(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'content type is required.' })
  contentType: string;
}
