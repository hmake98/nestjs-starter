import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserUpdateDto {
  @ApiProperty({
    description: 'User email address',
    example: faker.internet.email(),
    required: false,
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().trim())
  public email?: string;

  @ApiProperty({
    description: 'User first name',
    example: faker.person.firstName(),
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(50, { message: i18nValidationMessage('validation.maxLength') })
  @Transform(({ value }) => value?.trim())
  public firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: faker.person.lastName(),
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(50, { message: i18nValidationMessage('validation.maxLength') })
  @Transform(({ value }) => value?.trim())
  public lastName?: string;

  @ApiProperty({
    description: 'User profile picture (storage key)',
    example: 'user-avatars/1234567890abcdef.jpg',
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  public avatar?: string;
}
