import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class UpdatePostDto {
  @ApiProperty({
    description: 'post content',
    example: faker.lorem.lines(2),
    required: true,
  })
  @IsString()
  @IsOptional()
  public content: string;

  @ApiProperty({
    description: 'post title',
    example: faker.lorem.words(),
    required: true,
  })
  @IsString()
  @IsOptional()
  public title: string;

  @ApiProperty({
    description: 'post pictures',
    example: ['storagekey', 'storagekey'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  public images?: string[];
}
