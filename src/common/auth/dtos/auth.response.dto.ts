import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/modules/user/dtos/user.response.dto';

export class AuthResponseDto {
  @ApiProperty({
    example: faker.string.alphanumeric(30),
    required: true,
    nullable: false,
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: UserResponseDto,
    required: true,
    nullable: false,
  })
  @Expose()
  user: UserResponseDto;
}