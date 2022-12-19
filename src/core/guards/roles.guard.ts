import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/core/decorators';
import { Role, TokenService } from '../../shared';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );
    if (allowUnauthorizedRequest) {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.getArgByIndex(0);
    const Authorization = request.headers['authorization'];
    const token = Authorization.replace('Bearer ', '');
    const verify = this.tokenService.verify(token);
    return requiredRoles.some((role) => role === verify['role']);
  }
}
