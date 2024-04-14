import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserLoginDto } from './auth.login.dto';
import { faker } from '@faker-js/faker';

export class UserCreateDto extends UserLoginDto {
  @ApiProperty({
    description: 'user first name',
    example: faker.person.firstName(),
    required: false,
  })
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
}
