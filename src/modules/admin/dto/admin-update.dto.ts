import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/database/entities';

export class AdminUpdateDto {
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
  public userProfile: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public phone: string;

  @ApiProperty({ required: false })
  @IsEnum(Role)
  @IsOptional()
  public role: Role;
}
