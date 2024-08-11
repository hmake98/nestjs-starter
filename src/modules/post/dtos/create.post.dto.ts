import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ArrayMaxSize,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post content',
    example: faker.lorem.paragraph(),
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @MinLength(10, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(1000, { message: i18nValidationMessage('validation.maxLength') })
  @Transform(({ value }) => value?.trim())
  public content: string;

  @ApiProperty({
    description: 'Post title',
    example: faker.lorem.sentence(),
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(100, { message: i18nValidationMessage('validation.maxLength') })
  @Transform(({ value }) => value?.trim())
  public title: string;

  @ApiProperty({
    description: 'Post images (storage keys)',
    example: [faker.string.uuid(), faker.string.uuid()],
    required: false,
    type: [String],
  })
  @IsArray({ message: i18nValidationMessage('validation.isArray') })
  @IsOptional()
  @ArrayMaxSize(5, { message: i18nValidationMessage('validation.arrayMaxSize') })
  @IsString({ each: true, message: i18nValidationMessage('validation.isString') })
  @Type(() => String)
  public images?: string[];
}
