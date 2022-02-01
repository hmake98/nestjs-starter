import { SetMetadata } from '@nestjs/common';
import { Role } from '../database/schemas/role.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
