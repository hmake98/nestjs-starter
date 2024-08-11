import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const AllowedRoles = (roles: Role[]): CustomDecorator<string> =>
  SetMetadata('ROLES_KEY', roles);
