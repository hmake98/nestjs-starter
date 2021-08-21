import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'refreshToken is not provided' })
  public refreshToken: string;
}
