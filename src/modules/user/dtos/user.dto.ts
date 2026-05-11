import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

import { UserRole } from 'src/common/database/enums/role.enum';
import type { UserEntity } from 'src/common/database/interfaces/user.interface';

export class UserResponseDto implements Omit<UserEntity, 'passwordHash'> {
    @ApiProperty({
        example: faker.string.uuid(),
    })
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: faker.internet.email(),
    })
    @Expose()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    firstName: string | null;

    @ApiProperty({
        example: faker.person.lastName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    lastName: string | null;

    @ApiProperty({
        example: faker.image.avatar(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    avatar: string | null;

    @ApiProperty({
        example: faker.internet.username(),
    })
    @Expose()
    @IsString()
    userName: string;

    @ApiProperty({
        example: faker.phone.number(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    phone: string | null;

    @ApiProperty({
        enum: UserRole,
        example: faker.helpers.arrayElement(Object.values(UserRole)),
    })
    @Expose()
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty({
        example: faker.datatype.boolean(),
    })
    @Expose()
    @IsBoolean()
    isVerified: boolean;

    @ApiProperty({
        example: faker.date.past().toISOString(),
    })
    @Expose()
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: faker.date.recent().toISOString(),
    })
    @Expose()
    @IsDate()
    updatedAt: Date;

    @ApiProperty({
        example: faker.date.future().toISOString(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsDate()
    @IsOptional()
    deletedAt: Date | null;

    @ApiHideProperty()
    @Exclude()
    passwordHash: string;
}

export class UserGetProfileResponseDto extends UserResponseDto {}

export class UserUpdateProfileResponseDto extends UserResponseDto {}
