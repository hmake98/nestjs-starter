import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserUpdateDto } from '../dtos/user.update.dto';

describe('UserService', () => {
  let userService: UserService;

  const prismaServiceMock = {
    users: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 'user-id';
      const userData: UserUpdateDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        profile: 'https://example.com/avatar.png',
      };
      const updatedUser = {
        id: userId,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        avatar: {
          file_name: 'avatar_123456789',
          link: userData.profile,
        },
      };

      prismaServiceMock.users.findUnique.mockResolvedValueOnce({ id: userId });
      prismaServiceMock.users.update.mockResolvedValueOnce(updatedUser);

      const result = await userService.updateUser(userId, userData);

      expect(result).toEqual(updatedUser);
    });

    it('should throw 404 error if user not found', async () => {
      const userId = 'user-id';
      const userData: UserUpdateDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        profile: 'https://example.com/avatar.png',
      };

      prismaServiceMock.users.findUnique.mockResolvedValueOnce(null);

      await expect(
        userService.updateUser(userId, userData),
      ).rejects.toThrowError(
        new HttpException('userNotFound', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 'user-id';
      const userProfile = {
        id: userId,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: {
          file_name: 'avatar_123456789',
          link: 'https://example.com/avatar.png',
        },
      };

      prismaServiceMock.users.findUnique.mockResolvedValueOnce(userProfile);

      const result = await userService.getProfile(userId);

      expect(result).toEqual(userProfile);
    });
  });
});
