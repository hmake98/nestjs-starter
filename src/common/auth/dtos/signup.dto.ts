import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'email is not provided' })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'password is not provided' })
  public password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'firstName is not provided' })
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'lastName is not provided' })
  public lastName: string;
}
