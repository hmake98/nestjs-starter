import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { EncryptionService } from '../../../common/helper/services/encryption.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { Roles } from '@prisma/client';
import { BullModule } from '@nestjs/bull';
import { BullQueues } from '../../../app/app.constant';

describe('AuthService', () => {
  let authService: AuthService;

  const encryptionServiceMock = {
    match: jest.fn(),
    createHash: jest.fn(),
  };

  const prismaServiceMock = {
    users: {
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
          name: BullQueues.EMAIL,
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

  describe('login', () => {
    it('should return access token and user on successful login', async () => {
      const mockUser = {
        id: 'user123',
        first_name: 'test',
        last_name: 'user',
        phone: '123456789',
        is_deleted: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        email: 'existinguser@example.com',
        password: 'hashedPassword',
        avatar_id: null,
        role: Roles.USER,
      };

      prismaServiceMock.users.findUnique.mockResolvedValue(mockUser);
      encryptionServiceMock.match.mockReturnValue(true);
      jwtServiceMock.sign.mockReturnValue('mockAccessToken');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.accessToken).toEqual('mockAccessToken');
      expect(result.user).toEqual(mockUser);
    });

    it('should throw 404 if password is invalid', async () => {
      const mockUser = {
        id: 'user123',
        first_name: 'test',
        last_name: 'user',
        phone: '123456789',
        is_deleted: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        email: 'existinguser@example.com',
        password: 'hashedPassword',
        avatar_id: null,
        role: Roles.USER,
      };

      prismaServiceMock.users.findUnique.mockResolvedValue(mockUser);
      encryptionServiceMock.match.mockReturnValue(false);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'invalidPassword',
        }),
      ).rejects.toThrowError(
        new HttpException('invalidPassword', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('signup', () => {
    it('should return access token and user on successful signup', async () => {
      const mockUserCreateDto: UserCreateDto = {
        email: 'newuser@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'newPassword',
      };

      const mockUser = {
        id: 'user123',
        first_name: 'test',
        last_name: 'user',
        phone: '123456789',
        is_deleted: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        email: 'existinguser@example.com',
        password: 'hashedPassword',
        avatar_id: null,
        role: Roles.USER,
      };

      prismaServiceMock.users.findUnique.mockResolvedValue(null);
      prismaServiceMock.users.create.mockResolvedValue(mockUser);
      encryptionServiceMock.createHash.mockReturnValue('hashedNewPassword');
      jwtServiceMock.sign.mockReturnValue('mockAccessToken');

      const result = await authService.signup(mockUserCreateDto);

      expect(result.accessToken).toEqual('mockAccessToken');
      expect(result.user).toEqual(mockUser);
    });

    it('should throw 409 if user already exists', async () => {
      prismaServiceMock.users.findUnique.mockResolvedValue({
        id: 'user123',
        first_name: 'test',
        last_name: 'user',
        phone: '123456789',
        is_deleted: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        email: 'existinguser@example.com',
        password: 'hashedPassword',
        avatar_id: null,
        role: Roles.USER,
      });

      await expect(
        authService.signup({
          email: 'existinguser@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'existingPassword',
        }),
      ).rejects.toThrowError(
        new HttpException('userExists', HttpStatus.CONFLICT),
      );
    });
  });
});
