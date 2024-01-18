import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { IUserService } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(userId: string, data: UserUpdateDto) {
    try {
      const { email, firstName, lastName, profile } = data;
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      const result = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          avatar: profile,
        },
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  async me(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
