import { Roles } from '@prisma/client';

export interface IAuthUser {
  userId: string;
  role: Roles;
}
