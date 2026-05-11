import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UserUpdateDto {
    @ApiProperty({
        example: faker.internet.email(),
        required: false,
    })
    @IsEmail()
    @IsOptional()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email?: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    firstName?: string;

    @ApiProperty({
        example: faker.person.lastName(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    lastName?: string;

    @ApiProperty({
        example: 'user-avatars/1234567890abcdef.jpg',
        required: false,
    })
    @IsString()
    @IsOptional()
    avatar?: string;
}
