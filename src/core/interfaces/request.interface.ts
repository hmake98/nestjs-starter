import { Roles } from '@prisma/client';

export interface IRequest {
  user: {
    role: Roles;
    userId: string;
  };
}

export interface IAuthUser {
  userId: string;
  role?: Roles;
}
