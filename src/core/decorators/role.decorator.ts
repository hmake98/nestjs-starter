import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/common/database/entities/user.entity';

export const Roles = (...roles: UserRoles[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
