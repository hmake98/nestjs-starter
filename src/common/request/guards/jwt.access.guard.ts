import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MCP_IS_PUBLIC } from '@hmake98/nestjs-mcp';

import { PUBLIC_ROUTE_KEY } from '../constants/request.constant';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Check if route is marked as public (your app's routes)
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            PUBLIC_ROUTE_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (isPublic) {
            return true;
        }

        // Check if route is MCP public (automatically set by MCP module)
        const isMCPPublic = this.reflector.getAllAndOverride<boolean>(
            MCP_IS_PUBLIC,
            [context.getHandler(), context.getClass()]
        );
        if (isMCPPublic) {
            return true; // MCP routes are automatically public
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
