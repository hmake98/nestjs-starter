import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { ListUsersDto } from './dto';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { Role, User } from '@prisma/client';
import { helpers } from 'src/utils/helper';
import { PrismaService, SuccessResponse } from 'src/shared';

@Injectable()
export class AdminService {
  public limit: number;
  public skip: number;

  constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) {
    this.limit = this.configService.get('limit');
    this.skip = this.configService.get('skip');
  }

  public async delete(id: number): Promise<SuccessResponse> {
    try {
      const response = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
      return { message: 'User deleted' }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async deleteMultiple(data: { ids: number[] }): Promise<SuccessResponse> {
    try {
      const { ids } = data;
      const response = await this.prisma.user.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
      return { message: 'Users are deleted' };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async list(query: ListUsersDto): Promise<User[]> {
    try {
      const { limit, sort, search, field, page } = query;
      return this.prisma.user.findMany({
        where: {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          [field]: sort,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
