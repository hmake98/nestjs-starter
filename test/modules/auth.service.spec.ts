import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';

import { UserRole as Role } from 'src/common/database/enums/role.enum';
import { UserRepository } from 'src/common/database/repositories/user.repository';
import { AuthService } from 'src/modules/auth/services/auth.service';

jest.mock('argon2', () => ({
    hash: jest.fn(),
    verify: jest.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;

    const mockUserRepository = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        existsById: jest.fn(),
        existsByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        hardDeleteByEmail: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    const mockConfigService = {
        getOrThrow: jest.fn((key: string) => {
            const map: Record<string, string> = {
                'auth.accessToken.secret': 'access-secret',
                'auth.accessToken.tokenExp': '1d',
                'auth.refreshToken.secret': 'refresh-secret',
                'auth.refreshToken.tokenExp': '7d',
            };
            return map[key];
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserRepository, useValue: mockUserRepository },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('throws when user is not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                service.login({
                    email: 'test@example.com',
                    password: 'Password1!',
                })
            ).rejects.toThrow(HttpException);
        });

        it('throws when password does not match', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                id: '123',
                password: 'hashed',
                role: Role.MEMBER,
            });
            (argon2.verify as jest.Mock).mockResolvedValue(false);

            await expect(
                service.login({
                    email: 'test@example.com',
                    password: 'wrong',
                })
            ).rejects.toThrow(HttpException);
        });

        it('returns tokens and user on success', async () => {
            const user = {
                id: '123',
                password: 'hashed',
                role: Role.MEMBER,
            };
            mockUserRepository.findByEmail.mockResolvedValue(user);
            (argon2.verify as jest.Mock).mockResolvedValue(true);
            mockJwtService.signAsync
                .mockResolvedValueOnce('access')
                .mockResolvedValueOnce('refresh');

            const result = await service.login({
                email: 'test@example.com',
                password: 'Password1!',
            });

            expect(result).toEqual({
                accessToken: 'access',
                refreshToken: 'refresh',
                user,
            });
            expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
        });
    });

    describe('signup', () => {
        it('throws when user already exists', async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(true);

            await expect(
                service.signup({
                    email: 'existing@example.com',
                    password: 'Password1!',
                })
            ).rejects.toThrow(HttpException);
        });

        it('hashes password and creates a user with MEMBER role', async () => {
            const newUser = {
                id: '123',
                email: 'new@example.com',
                role: Role.MEMBER,
            };
            mockUserRepository.existsByEmail.mockResolvedValue(false);
            (argon2.hash as jest.Mock).mockResolvedValue('hashed');
            mockUserRepository.create.mockResolvedValue(newUser);
            mockJwtService.signAsync
                .mockResolvedValueOnce('access')
                .mockResolvedValueOnce('refresh');

            const result = await service.signup({
                email: 'new@example.com',
                password: 'Password1!',
                firstName: 'John',
                lastName: 'Doe',
            });

            expect(argon2.hash).toHaveBeenCalledWith('Password1!');
            expect(mockUserRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: 'hashed',
                    role: Role.MEMBER,
                    firstName: 'John',
                    lastName: 'Doe',
                })
            );
            expect(result).toEqual({
                accessToken: 'access',
                refreshToken: 'refresh',
                user: newUser,
            });
        });

        it('sets firstName and lastName to null when not provided', async () => {
            const newUser = {
                id: '123',
                email: 'new@example.com',
                role: Role.MEMBER,
            };
            mockUserRepository.existsByEmail.mockResolvedValue(false);
            (argon2.hash as jest.Mock).mockResolvedValue('hashed');
            mockUserRepository.create.mockResolvedValue(newUser);
            mockJwtService.signAsync
                .mockResolvedValueOnce('access')
                .mockResolvedValueOnce('refresh');

            await service.signup({
                email: 'new@example.com',
                password: 'Password1!',
            });

            expect(mockUserRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ firstName: null, lastName: null })
            );
        });
    });

    describe('refreshTokens', () => {
        it('issues a new pair of tokens', async () => {
            mockJwtService.signAsync
                .mockResolvedValueOnce('new-access')
                .mockResolvedValueOnce('new-refresh');

            const result = await service.refreshTokens({
                userId: '123',
                role: Role.MEMBER,
            });

            expect(result).toEqual({
                accessToken: 'new-access',
                refreshToken: 'new-refresh',
            });
        });
    });
});
