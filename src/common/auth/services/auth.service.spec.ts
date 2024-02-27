import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { EncryptionService } from '../../../common/helper/services/encryption.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../dtos/signup.dto';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: EncryptionService,
          useValue: {
            match: jest.fn(),
            createHash: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
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
        avatar: null,
        role: Role.USER,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(encryptionService, 'match').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

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
        avatar: null,
        role: Role.USER,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(encryptionService, 'match').mockReturnValue(false);

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
        avatar: null,
        role: Role.USER,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest
        .spyOn(encryptionService, 'createHash')
        .mockReturnValue('hashedNewPassword');
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

      const result = await authService.signup(mockUserCreateDto);

      expect(result.accessToken).toEqual('mockAccessToken');
      expect(result.user).toEqual(mockUser);
    });

    it('should throw 409 if user already exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
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
        avatar: null,
        role: Role.USER,
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
