import { Roles, Users } from '@prisma/client';

export interface IAuthUser {
  userId: string;
  role: Roles;
}

export interface IAuthResponse {
  accessToken: string;
  user: Users;
}
