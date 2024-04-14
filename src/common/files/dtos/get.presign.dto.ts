import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileModuleType } from 'src/app/app.enum';

export class GetPresignDto {
  @ApiProperty({
    description: 'file name',
    example: faker.lorem.slug(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'file name is required.' })
  name: string;

  @ApiProperty({
    description: 'file store type',
    example: FileModuleType.UserProfile,
    required: true,
    enum: FileModuleType,
  })
  @IsEnum(FileModuleType, {
    message: '[Profile, Posts] should be enum',
  })
  @IsNotEmpty({ message: 'store type is required.' })
  storeType: FileModuleType;
}
