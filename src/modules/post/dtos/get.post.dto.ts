import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetPostsDto {
  @ApiProperty({
    description: 'limit',
    example: 10,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'limit is required' })
  public limit: number;

  @ApiProperty({
    description: 'page',
    example: 1,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'page is required' })
  public page: number;

  @ApiProperty({
    description: 'search',
    required: false,
  })
  @IsString()
  @IsOptional()
  public search?: string;
}
