import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { ROLES_DECORATOR_KEY } from '../constants/request.constant';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_DECORATOR_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest<{
            user?: { role?: Role | Role[] };
        }>();

        if (!user?.role) {
            throw new ForbiddenException('auth.error.userRoleNotDefined');
        }

        const userRole = user.role;
        const hasRole = requiredRoles.some(role =>
            Array.isArray(userRole) ? userRole.includes(role) : userRole === role
        );

        if (!hasRole) {
            throw new ForbiddenException('auth.error.insufficientPermissions');
        }

        return true;
    }
}
