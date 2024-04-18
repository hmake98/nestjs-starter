import { $Enums, Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements Users {
  avatar_id: string;
  created_at: Date;
  deleted_at: Date;
  email: string;
  first_name: string;
  id: string;
  is_deleted: boolean;
  is_verified: boolean;
  last_name: string;
  phone: string;
  role: $Enums.Roles;
  updated_at: Date;

  @Exclude()
  password: string;
}

export class GetProfileResponseDto extends UserResponseDto {}

export class UpdateProfileResponseDto extends UserResponseDto {}
