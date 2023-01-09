import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetPostsDto {
  @ApiProperty()
  @IsNumber()
  public limit: number;

  @ApiProperty()
  @IsNumber()
  public page: number;

  @ApiProperty()
  @IsString()
  public sort_col: string;

  @ApiProperty()
  @IsString()
  public sort_type: string;

  @ApiProperty()
  @IsString()
  public search: string;
}
