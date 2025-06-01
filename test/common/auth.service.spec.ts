import { getQueueToken } from '@nestjs/bull';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';

import { APP_BULL_QUEUES } from 'src/app/enums/app.enum';
import { AuthService } from 'src/common/auth/services/auth.service';
import { DatabaseService } from 'src/common/database/services/database.service';
import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';

describe('AuthService', () => {
    let service: AuthService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockHelperEncryptionService = {
        match: jest.fn(),
        createHash: jest.fn(),
        createJwtTokens: jest.fn(),
    };

    const mockEmailQueue = {
        add: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: DatabaseService, useValue: mockPrismaService },
                {
                    provide: HelperEncryptionService,
                    useValue: mockHelperEncryptionService,
                },
                {
                    provide: getQueueToken(APP_BULL_QUEUES.EMAIL),
                    useValue: mockEmailQueue,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should throw an error if user is not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(
                service.login({
                    email: 'test@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow(HttpException);
        });

        it('should throw an error if password does not match', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: '123',
                password: 'hashed_password',
            });
            mockHelperEncryptionService.match.mockResolvedValue(false);

            await expect(
                service.login({
                    email: 'test@example.com',
                    password: 'wrong_password',
                })
            ).rejects.toThrow(HttpException);
        });

        it('should return tokens and user if login is successful', async () => {
            const mockUser = {
                id: '123',
                password: 'hashed_password',
                role: Role.USER,
            };
            const mockTokens = {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockHelperEncryptionService.match.mockResolvedValue(true);
            mockHelperEncryptionService.createJwtTokens.mockResolvedValue(
                mockTokens
            );

            const result = await service.login({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result).toEqual({ ...mockTokens, user: mockUser });
        });
    });

    describe('signup', () => {
        it('should throw an error if user already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: '123' });

            await expect(
                service.signup({
                    email: 'existing@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow(HttpException);
        });

        it('should create a user and return tokens if signup is successful', async () => {
            const newUser = {
                id: '123',
                email: 'new@example.com',
                userName: 'newuser',
                role: Role.USER,
            };
            const tokens = {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockHelperEncryptionService.createHash.mockResolvedValue(
                'hashed_password'
            );
            mockPrismaService.user.create.mockResolvedValue(newUser);
            mockHelperEncryptionService.createJwtTokens.mockResolvedValue(
                tokens
            );

            const result = await service.signup({
                email: 'new@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
            });

            expect(result).toEqual({ ...tokens, user: newUser });
            expect(mockEmailQueue.add).toHaveBeenCalled();
        });
    });

    describe('refreshTokens', () => {
        it('should return new tokens when refreshTokens is called', async () => {
            const tokens = {
                accessToken: 'new_access_token',
                refreshToken: 'new_refresh_token',
            };

            mockHelperEncryptionService.createJwtTokens.mockResolvedValue(
                tokens
            );

            const result = await service.refreshTokens({
                userId: '123',
                role: Role.USER,
            });

            expect(result).toEqual(tokens);
        });
    });
});
