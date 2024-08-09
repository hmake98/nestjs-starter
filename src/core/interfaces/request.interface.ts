import { Roles } from '@prisma/client';

export interface IAuthUser {
  userId: string;
  role: Roles;
}

export interface IRequest {
  user: IAuthUser;
}
