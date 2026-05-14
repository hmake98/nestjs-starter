import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { JwtRefreshGuard } from 'src/common/request/guards/jwt-refresh.guard';

describe('JwtRefreshGuard', () => {
    let guard: JwtRefreshGuard;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtRefreshGuard,
                {
                    provide: Reflector,
                    useValue: { getAllAndOverride: jest.fn() },
                },
            ],
        }).compile();

        guard = module.get(JwtRefreshGuard);
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
        it('delegates to passport super.canActivate', () => {
            const ctx = mockContext();
            const superSpy = jest
                .spyOn(
                    Object.getPrototypeOf(JwtRefreshGuard.prototype),
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
