import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
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
    example: faker.string.alphanumeric(30),
    required: true,
    nullable: false,
  })
  @Expose()
  refreshToken: string;

  @ApiProperty({
    example: UserResponseDto,
    required: true,
    nullable: false,
  })
  @Expose()
  @Type(() => UserResponseDto)
  @ValidateNested()
  user: UserResponseDto;
}

export class AuthRefreshResponseDto {
  @ApiProperty({
    example: faker.string.alphanumeric(30),
    required: true,
    nullable: false,
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: faker.string.alphanumeric(30),
    required: true,
    nullable: false,
  })
  @Expose()
  refreshToken: string;
}
