import { Roles } from '@prisma/client';

export interface IRequest {
  user: {
    role: Roles;
    userId: string;
  };
}
