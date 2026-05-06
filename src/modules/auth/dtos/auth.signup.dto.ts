import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

import { UserLoginDto } from './auth.login.dto';

export class UserCreateDto extends UserLoginDto {
    @ApiProperty({
        example: faker.person.firstName(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(1, 50)
    public firstName?: string;

    @ApiProperty({
        example: faker.person.lastName(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(1, 50)
    public lastName?: string;
}
