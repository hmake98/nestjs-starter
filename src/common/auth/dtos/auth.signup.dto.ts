import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { UserLoginDto } from './auth.login.dto';

export class UserCreateDto extends UserLoginDto {
  @ApiProperty({
    description: 'User first name',
    example: faker.person.firstName(),
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.errors.mustBeString') })
  @IsOptional()
  @Length(1, 50, {
    message: i18nValidationMessage('validation.errors.lengthBetween', { min: 1, max: 50 }),
  })
  public firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: faker.person.lastName(),
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.errors.mustBeString') })
  @IsOptional()
  @Length(1, 50, {
    message: i18nValidationMessage('validation.errors.lengthBetween', { min: 1, max: 50 }),
  })
  public lastName?: string;
}
