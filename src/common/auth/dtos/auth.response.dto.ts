import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { UserResponseDto } from 'src/modules/user/dtos/response/user.response';

export class TokenDto {
    @ApiProperty({
        example: faker.string.alphanumeric({ length: 64 }),
        required: true,
    })
    @Expose()
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({
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
        type: () => UserResponseDto,
        required: true,
    })
    @Expose()
    @Type(() => UserResponseDto)
    @ValidateNested()
    user: UserResponseDto;
}

export class AuthRefreshResponseDto extends TokenDto {}
