import { Role } from '@prisma/client';

export interface IAuthUser {
  userId: string;
  role: Role;
}
