import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('ROLES_KEY', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('auth.errors.userRoleNotDefined');
    }

    const hasRole = requiredRoles.some(
      role => user.role === role || (Array.isArray(user.role) && user.role.includes(role)),
    );

    if (!hasRole) {
      throw new ForbiddenException('auth.errors.insufficientPermissions');
    }

    return true;
  }
}
