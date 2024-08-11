import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';

export class UserResponseDto implements Partial<User> {
  @ApiProperty({
    description: 'User ID',
    example: faker.string.uuid(),
  })
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User email',
    example: faker.internet.email(),
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: faker.person.firstName(),
    required: false,
    nullable: true,
  })
  @Expose()
  @IsString()
  @IsOptional()
  firstName: string | null;

  @ApiProperty({
    description: 'User last name',
    example: faker.person.lastName(),
    required: false,
    nullable: true,
  })
  @Expose()
  @IsString()
  @IsOptional()
  lastName: string | null;

  @ApiProperty({
    description: 'User avatar URL',
    example: faker.image.avatar(),
    required: false,
    nullable: true,
  })
  @Expose()
  @IsString()
  @IsOptional()
  avatar: string | null;

  @ApiProperty({
    description: 'User username',
    example: faker.internet.userName(),
  })
  @Expose()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'User phone number',
    example: faker.phone.number(),
    required: false,
    nullable: true,
  })
  @Expose()
  @IsString()
  @IsOptional()
  phone: string | null;

  @ApiProperty({
    description: 'User role',
    enum: $Enums.Role,
    example: faker.helpers.arrayElement(Object.values($Enums.Role)),
  })
  @Expose()
  @IsEnum($Enums.Role)
  role: $Enums.Role;

  @ApiProperty({
    description: 'Is the user verified',
    example: faker.datatype.boolean(),
  })
  @Expose()
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({
    description: 'User creation date',
    example: faker.date.past().toISOString(),
  })
  @Expose()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: faker.date.recent().toISOString(),
  })
  @Expose()
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'User deletion date',
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
  password: string;
}

export class GetProfileResponseDto extends UserResponseDto {}

export class UpdateProfileResponseDto extends UserResponseDto {}
