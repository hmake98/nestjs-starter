import { HttpStatus, Injectable, HttpException, Logger } from '@nestjs/common';

import { PrismaService } from 'src/common/database/services/prisma.service';

import { ApiGenericResponseDto } from '../../../core/dtos/response.dto';
import { GetProfileResponseDto, UpdateProfileResponseDto } from '../dtos/user.response.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { IUserService } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(userId: string, data: UserUpdateDto): Promise<UpdateProfileResponseDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('users.errors.userNotFound', HttpStatus.NOT_FOUND);
      }
      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<ApiGenericResponseDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('users.errors.userNotFound', HttpStatus.NOT_FOUND);
      }
      await this.prismaService.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });

      return {
        success: true,
        message: 'users.success.userDeleted',
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(id: string): Promise<GetProfileResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('users.errors.userNotFound', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
