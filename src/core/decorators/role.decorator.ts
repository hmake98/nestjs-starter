import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../types';

export const Roles = (...roles: UserRoles[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
