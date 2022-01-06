import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Role } from 'src/database/entities';

export class AdminCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No email provided' })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No password provided' })
  public password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No firstname provided' })
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No lastname provided' })
  public lastName: string;

  @IsEnum(Role)
  @IsOptional()
  public role: Role;
}
