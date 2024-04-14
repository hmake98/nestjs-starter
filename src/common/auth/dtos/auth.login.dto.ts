import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: 'user email address',
    example: faker.internet.email(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'email is not provided' })
  public email: string;

  @ApiProperty({
    description: 'user password',
    example: faker.internet.password(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'password is not provided' })
  public password: string;
}
