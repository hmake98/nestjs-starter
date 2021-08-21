import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';
import { ConfigService } from 'src/config/config.service';
import { Role } from 'src/database/entities';
import { ROLES_KEY } from 'src/decorators';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly moduleRef: ModuleRef, private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.getArgByIndex(0);
    const token = request.headers['authorization'];
    const tokenService = new TokenService(new ConfigService());
    const verify = await tokenService.verify(token);
    if (requiredRoles.some((role) => role === verify.role)) {
      return true;
    }
    return false;
  }
}
