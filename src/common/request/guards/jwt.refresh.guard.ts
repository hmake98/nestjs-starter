import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(
        err: any,
        user: any,
        _info: any,
        _context: ExecutionContext,
        _status?: any
    ) {
        if (err || !user) {
            throw (
                err ||
                new UnauthorizedException('auth.error.refreshTokenUnauthorized')
            );
        }
        return user;
    }
}
