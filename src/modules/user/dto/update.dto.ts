import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public profile: number;
}
