import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const userId = 'user123';
      const updateUserDto: UserUpdateDto = {
        email: 'updated@example.com',
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        profile: 'updated-avatar-url',
      };

      // Mocking PrismaService methods
      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValue({ id: userId });
      prismaService.user.update = jest.fn().mockResolvedValue(updateUserDto);

      const result = await userService.updateUser(userId, updateUserDto);

      expect(result).toEqual(updateUserDto);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          email: updateUserDto.email.trim(),
          first_name: updateUserDto.firstName.trim(),
          last_name: updateUserDto.lastName.trim(),
          avatar: updateUserDto.profile,
        },
      });
    });

    it('should throw HttpException if user is not found', async () => {
      const userId = 'user123';
      const updateUserDto: UserUpdateDto = {
        email: 'updated@example.com',
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        profile: 'updated-avatar-url',
      };

      // Mocking PrismaService method to return null (user not found)
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        userService.updateUser(userId, updateUserDto),
      ).rejects.toThrowError(
        new HttpException('userNotFound', HttpStatus.NOT_FOUND),
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return user profile', async () => {
      const userId = 'user123';
      const userData = {
        id: userId,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Mocking PrismaService method
      prismaService.user.findUnique = jest.fn().mockResolvedValue(userData);

      const result = await userService.me(userId);

      expect(result).toEqual(userData);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
