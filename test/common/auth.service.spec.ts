/* eslint-disable import/no-unresolved */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { BullModule } from '@nestjs/bull';

import { PrismaService } from '../../src/common/helper/services/prisma.service';
import { EncryptionService } from '../../src/common/helper/services/encryption.service';
import { AuthService } from '../../src/common/auth/services/auth.service';
import { UserCreateDto } from '../../src/common/auth/dtos/auth.signup.dto';
import { UserLoginDto } from '../../src/common/auth/dtos/auth.login.dto';
import { BullQueues } from '../../src/common/notification/constants/notification.constants';

describe('AuthService', () => {
  let authService: AuthService;

  const encryptionServiceMock = {
    match: jest.fn(),
    createHash: jest.fn(),
    createJwtTokens: jest.fn(),
  };

  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: BullQueues.EMAIL_QUEUE,
        }),
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: EncryptionService,
          useValue: encryptionServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw HttpException if user not found', async () => {
      const loginDto: UserLoginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };
      jest.spyOn(prismaServiceMock.user, 'findUnique').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
      await expect(authService.login(loginDto)).rejects.toThrow(
        'users.userNotFound',
      );
    });

    it('should throw HttpException if password is invalid', async () => {
      const loginDto: UserLoginDto = {
        email: 'existing@example.com',
        password: 'wrongpassword',
      };
      const existingUser = {
        id: '1',
        role: Roles.USER,
        password: 'hashedpassword',
      };
      jest
        .spyOn(prismaServiceMock.user, 'findUnique')
        .mockResolvedValue(existingUser);
      jest.spyOn(encryptionServiceMock, 'match').mockReturnValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
      await expect(authService.login(loginDto)).rejects.toThrow(
        'auth.invalidPassword',
      );
    });

    it('should return tokens if login is successful', async () => {
      const loginDto: UserLoginDto = {
        email: 'existing@example.com',
        password: 'correctpassword',
      };
      const existingUser = {
        id: '1',
        role: Roles.USER,
        password: 'hashedpassword',
      };
      jest
        .spyOn(prismaServiceMock.user, 'findUnique')
        .mockResolvedValue(existingUser);
      jest.spyOn(encryptionServiceMock, 'match').mockReturnValue(true);
      jest
        .spyOn(encryptionServiceMock, 'createJwtTokens')
        .mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' });

      const result = await authService.login(loginDto);

      expect(result.accessToken).toBe('access');
      expect(result.refreshToken).toBe('refresh');
      expect(result.user).toEqual(existingUser);
    });
  });

  describe('signup', () => {
    it('should throw HttpException if user already exists', async () => {
      const signUpDto: UserCreateDto = {
        email: 'existing@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      };
      jest.spyOn(prismaServiceMock.user, 'findUnique').mockResolvedValue({});

      await expect(authService.signup(signUpDto)).rejects.toThrow(
        HttpException,
      );
      await expect(authService.signup(signUpDto)).rejects.toThrow(
        'users.userExists',
      );
    });

    it('should create user and return tokens if signup is successful', async () => {
      const signUpDto: UserCreateDto = {
        email: 'new@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      };
      const createdUser = { id: '1', role: Roles.USER };
      jest.spyOn(prismaServiceMock.user, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prismaServiceMock.user, 'create')
        .mockResolvedValue(createdUser);
      jest
        .spyOn(encryptionServiceMock, 'createHash')
        .mockReturnValue('hashedpassword');
      jest
        .spyOn(encryptionServiceMock, 'createJwtTokens')
        .mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' });

      const result = await authService.signup(signUpDto);

      expect(result.accessToken).toBe('access');
      expect(result.refreshToken).toBe('refresh');
      expect(result.user).toEqual(createdUser);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens', async () => {
      const payload = { userId: '1', role: Roles.USER };
      jest.spyOn(encryptionServiceMock, 'createJwtTokens').mockResolvedValue({
        accessToken: 'new_access',
        refreshToken: 'new_refresh',
      });

      const result = await authService.refreshTokens(payload);

      expect(result.accessToken).toBe('new_access');
      expect(result.refreshToken).toBe('new_refresh');
    });
  });
});
