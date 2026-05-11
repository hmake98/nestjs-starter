import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { type IRequest } from '../interfaces/request.interface';

export const AuthUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<IRequest>();
        return request.user;
    }
);
