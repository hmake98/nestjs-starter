import { Roles, Users } from '@prisma/client';

export interface IAuthUser {
  userId: string;
  role?: Roles;
}

export interface IAuthResponse extends IAuthTokenResponse {
  user: Users;
}

export interface IAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}
