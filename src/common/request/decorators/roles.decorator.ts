import { type CustomDecorator, SetMetadata } from '@nestjs/common';

import { type UserRole } from 'src/common/database/enums/role.enum';

import { ROLES_DECORATOR_KEY } from '../constants/request.constant';

export const AllowedRoles = (roles: UserRole[]): CustomDecorator<string> =>
    SetMetadata(ROLES_DECORATOR_KEY, roles);
