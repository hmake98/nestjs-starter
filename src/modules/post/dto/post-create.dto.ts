import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No content provided' })
  public content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No title provided' })
  public title: string;
}
