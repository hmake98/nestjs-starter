import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public profile: string;
}
