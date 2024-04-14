import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Roles } from '@prisma/client';

export const AllowedRoles = (roles: Roles[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
