import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { IUserService } from '../interfaces/user.service.interface';
import { Users } from '@prisma/client';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(userId: string, data: UserUpdateDto): Promise<Users> {
    try {
      const { email, firstName, lastName, profile } = data;
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      return this.prismaService.users.update({
        where: {
          id: userId,
        },
        data: {
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          avatar: {
            create: {
              file_name: `avatar_${Date.now()}`,
              link: profile,
            },
          },
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async getProfile(id: string): Promise<Users> {
    return this.prismaService.users.findUnique({
      where: {
        id,
      },
    });
  }
}
