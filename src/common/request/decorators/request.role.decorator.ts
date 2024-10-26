import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

import { ROLES_DECORATOR_KEY } from '../constants/request.constant';

export const AllowedRoles = (roles: Role[]): CustomDecorator<string> =>
    SetMetadata(ROLES_DECORATOR_KEY, roles);
