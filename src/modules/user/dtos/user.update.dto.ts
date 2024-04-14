import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    description: 'user email address',
    example: faker.internet.email(),
    required: false,
  })
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty({
    description: 'user first name',
    example: faker.person.firstName(),
    required: false,
  })
  @IsString()
  @IsOptional()
  public firstName?: string;

  @ApiProperty({
    description: 'user last name',
    example: faker.person.lastName(),
    required: false,
  })
  @IsString()
  @IsOptional()
  public lastName?: string;

  @ApiProperty({
    description: 'user profile picture',
    example: faker.image.avatar(),
    required: false,
  })
  @IsString()
  @IsOptional()
  public profile?: string;
}
