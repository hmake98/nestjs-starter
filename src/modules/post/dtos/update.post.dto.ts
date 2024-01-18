import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public title: string;
}
