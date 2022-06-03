import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from 'src/config/config.service';
import { Role } from 'src/database/entities';
import { ROLES_KEY } from 'src/core/decorators';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
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
    const tokenService = new TokenService(new ConfigService());
    const verify = await tokenService.verify(token);
    if (requiredRoles.some((role) => role === verify.role)) {
      return true;
    }
    return false;
  }
}
