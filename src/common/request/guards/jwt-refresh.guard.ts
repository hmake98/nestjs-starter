import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest<TUser = unknown>(
        err: unknown,
        user: TUser | false,
        _info: unknown,
        _context: ExecutionContext,
        _status?: unknown
    ): TUser {
        if (err) {
            throw err instanceof Error
                ? err
                : new UnauthorizedException(
                      'auth.error.refreshTokenUnauthorized'
                  );
        }
        if (!user) {
            throw new UnauthorizedException(
                'auth.error.refreshTokenUnauthorized'
            );
        }
        return user;
    }
}
