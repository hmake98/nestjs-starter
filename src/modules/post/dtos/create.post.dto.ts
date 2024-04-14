import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'post content',
    example: faker.lorem.lines(2),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'content is not provided' })
  public content: string;

  @ApiProperty({
    description: 'post title',
    example: faker.lorem.words(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'title is not provided' })
  public title: string;
}
