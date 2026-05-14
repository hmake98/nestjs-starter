import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { PUBLIC_ROUTE_KEY } from 'src/common/request/constants/request.constant';
import { JwtAccessGuard } from 'src/common/request/guards/jwt-access.guard';

describe('JwtAccessGuard', () => {
    let guard: JwtAccessGuard;
    let reflector: jest.Mocked<Reflector>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtAccessGuard,
                {
                    provide: Reflector,
                    useValue: { getAllAndOverride: jest.fn() },
                },
            ],
        }).compile();

        guard = module.get(JwtAccessGuard);
        reflector = module.get<Reflector>(Reflector) as jest.Mocked<Reflector>;
    });

    const mockContext = (): ExecutionContext =>
        ({
            getHandler: jest.fn().mockReturnValue('handler'),
            getClass: jest.fn().mockReturnValue('Controller'),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ headers: {} }),
            }),
        }) as unknown as ExecutionContext;

    describe('canActivate', () => {
        it('returns true immediately for public routes', () => {
            reflector.getAllAndOverride.mockReturnValue(true);
            const ctx = mockContext();
            expect(guard.canActivate(ctx)).toBe(true);
            expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
                PUBLIC_ROUTE_KEY,
                [ctx.getHandler(), ctx.getClass()]
            );
        });

        it('delegates to passport super.canActivate for protected routes', () => {
            reflector.getAllAndOverride.mockReturnValue(false);
            const ctx = mockContext();
            const superSpy = jest
                .spyOn(
                    Object.getPrototypeOf(JwtAccessGuard.prototype),
                    'canActivate'
                )
                .mockReturnValue(true);

            const result = guard.canActivate(ctx);
            expect(superSpy).toHaveBeenCalledWith(ctx);
            expect(result).toBe(true);
            superSpy.mockRestore();
        });
    });

    describe('handleRequest', () => {
        it('returns the user when valid', () => {
            const user = { userId: '1', role: 'MEMBER' };
            expect(guard.handleRequest(null, user, null, mockContext())).toBe(
                user
            );
        });

        it('re-throws when err is an Error instance', () => {
            const err = new UnauthorizedException('original');
            expect(() =>
                guard.handleRequest(err, false, null, mockContext())
            ).toThrow(err);
        });

        it('wraps non-Error err in UnauthorizedException', () => {
            expect(() =>
                guard.handleRequest('string-error', false, null, mockContext())
            ).toThrow(UnauthorizedException);
        });

        it('throws UnauthorizedException when user is falsy and no err', () => {
            expect(() =>
                guard.handleRequest(null, false, null, mockContext())
            ).toThrow(UnauthorizedException);
        });
    });
});
