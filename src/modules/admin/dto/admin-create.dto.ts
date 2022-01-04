import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  public firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No lastname provided' })
  public lastname: string;
}
