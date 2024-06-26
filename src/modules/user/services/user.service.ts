import { HttpStatus, Injectable, HttpException } from '@nestjs/common';

import { UserUpdateDto } from '../dtos/user.update.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { IUserService } from '../interfaces/user.service.interface';
import { GenericResponseDto } from '../../../core/dtos/response.dto';
import {
  GetProfileResponseDto,
  UpdateProfileResponseDto,
} from '../dtos/user.response.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(
    userId: string,
    data: UserUpdateDto,
  ): Promise<UpdateProfileResponseDto> {
    try {
      const { email, firstName, lastName, avatar } = data;
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('users.userNotFound', HttpStatus.NOT_FOUND);
      }
      return this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          email: email?.trim(),
          first_name: firstName?.trim(),
          last_name: lastName?.trim(),
          avatar,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async deleteUser(userId: string): Promise<GenericResponseDto> {
    try {
      const check = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!check) {
        throw new HttpException('users.userNotFound', HttpStatus.NOT_FOUND);
      }
      await this.prismaService.user.update({
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
        where: {
          id: userId,
        },
      });
      return {
        status: true,
        message: 'users.userDeleted',
      };
    } catch (e) {
      throw e;
    }
  }

  async getProfile(id: string): Promise<GetProfileResponseDto> {
    try {
      const check = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
      if (!check) {
        throw new HttpException('users.userNotFound', HttpStatus.NOT_FOUND);
      }
      return check;
    } catch (e) {
      throw e;
    }
  }
}
