import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  @ApiProperty()
  avatar_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  is_verified: boolean;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  role: $Enums.Roles;

  @ApiProperty()
  updated_at: Date;

  @ApiHideProperty()
  @Exclude()
  password: string;
}

export class GetProfileResponseDto extends UserResponseDto {}

export class UpdateProfileResponseDto extends UserResponseDto {}
