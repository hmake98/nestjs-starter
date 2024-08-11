import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetPostsDto {
  @ApiProperty({
    description: 'Number of posts to return per page',
    example: 10,
    required: true,
    type: Number,
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @Min(1, { message: i18nValidationMessage('validation.min') })
  @Max(100, { message: i18nValidationMessage('validation.max') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @Type(() => Number)
  public limit: number;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: true,
    type: Number,
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @Min(1, { message: i18nValidationMessage('validation.min') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @Type(() => Number)
  public page: number;

  @ApiProperty({
    description: 'Search term for filtering posts',
    required: false,
    type: String,
  })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  public search?: string;
}
