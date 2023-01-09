import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from '../../shared';

export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
