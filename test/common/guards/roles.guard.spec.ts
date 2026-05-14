import { type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { UserRole } from 'src/common/database/enums/role.enum';
import { ROLES_DECORATOR_KEY } from 'src/common/request/constants/request.constant';
import { RolesGuard } from 'src/common/request/guards/roles.guard';

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: jest.Mocked<Reflector>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesGuard,
                {
                    provide: Reflector,
                    useValue: { getAllAndOverride: jest.fn() },
                },
            ],
        }).compile();

        guard = module.get(RolesGuard);
        reflector = module.get<Reflector>(Reflector) as jest.Mocked<Reflector>;
    });

    const mockContext = (user?: unknown): ExecutionContext =>
        ({
            getHandler: jest.fn().mockReturnValue('handler'),
            getClass: jest.fn().mockReturnValue('Controller'),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ user }),
            }),
        }) as unknown as ExecutionContext;

    it('returns true when no roles required', () => {
        reflector.getAllAndOverride.mockReturnValue(undefined);
        expect(guard.canActivate(mockContext())).toBe(true);
        expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
            ROLES_DECORATOR_KEY,
            [expect.anything(), expect.anything()]
        );
    });

    it('returns true when user has the required role (string)', () => {
        reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
        expect(guard.canActivate(mockContext({ role: UserRole.ADMIN }))).toBe(
            true
        );
    });

    it('returns true when user has the required role in an array', () => {
        reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
        expect(
            guard.canActivate(
                mockContext({ role: [UserRole.ADMIN, UserRole.MEMBER] })
            )
        ).toBe(true);
    });

    it('throws ForbiddenException when user has no role property', () => {
        reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
        expect(() =>
            guard.canActivate(mockContext({ role: undefined }))
        ).toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when user is undefined', () => {
        reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
        expect(() => guard.canActivate(mockContext(undefined))).toThrow(
            ForbiddenException
        );
    });

    it('throws ForbiddenException when user has insufficient role', () => {
        reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
        expect(() =>
            guard.canActivate(mockContext({ role: UserRole.MEMBER }))
        ).toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when role array does not include required', () => {
        reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
        expect(() =>
            guard.canActivate(
                mockContext({ role: [UserRole.MEMBER, UserRole.DEVELOPER] })
            )
        ).toThrow(ForbiddenException);
    });
});
