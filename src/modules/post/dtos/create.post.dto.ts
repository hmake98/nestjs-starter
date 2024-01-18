import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'content is not provided' })
  public content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'title is not provided' })
  public title: string;
}
