import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { PUBLIC_ROUTE_KEY } from '../constants/request.constant';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            PUBLIC_ROUTE_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (isPublic) {
            return true;
        }
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
                new UnauthorizedException('auth.error.accessTokenUnauthorized')
            );
        }
        return user;
    }
}
