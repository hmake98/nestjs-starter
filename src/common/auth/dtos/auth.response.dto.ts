import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { UserResponseDto } from 'src/modules/user/dtos/user.response.dto';

export class TokenDto {
  @ApiProperty({
    description: 'JWT access token',
    example: faker.string.alphanumeric({ length: 64 }),
    required: true,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: faker.string.alphanumeric({ length: 64 }),
    required: true,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthResponseDto extends TokenDto {
  @ApiProperty({
    description: 'User information',
    type: () => UserResponseDto,
    required: true,
  })
  @Expose()
  @Type(() => UserResponseDto)
  @ValidateNested()
  user: UserResponseDto;
}

export class AuthRefreshResponseDto extends TokenDto {}
