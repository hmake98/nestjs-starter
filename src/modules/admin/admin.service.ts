import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";
import { CreateUserDto, ListUsersDto } from "./dto";
import { User } from "@prisma/client";
import { PrismaService, SuccessResponse } from "src/shared";
import { UpdateUsersDto } from "./dto/user/user-update.dto";
import { DeleteUsersDto } from "./dto/user/user-delete.dto";
import { I18nContext } from "nestjs-i18n";

@Injectable()
export class AdminService {
  public limit: number;
  public skip: number;

  constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) {
    this.limit = this.configService.get("limit");
    this.skip = this.configService.get("skip");
  }

  public async updateMultiple(users: UpdateUsersDto[]): Promise<User[]> {
    return Promise.all(
      users.map(item => {
        return this.prisma.user.update({
          data: {
            ...item,
          },
          where: {
            id: item.id,
          },
        });
      }),
    );
  }

  public async deleteMultiple(context: I18nContext, data: DeleteUsersDto): Promise<SuccessResponse> {
    try {
      const { ids } = data;
      await this.prisma.user.updateMany({
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
      const message = await context.translate("user.user_deleted_success", { lang: context.lang });
      return { message };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, firstName, lastName, phone, password } = data;
    return this.prisma.user.create({
      data: {
        firstName,
        lastName,
        password,
        email,
        phone,
        role: "USER",
      },
    });
  }

  public async list(query: ListUsersDto): Promise<User[]> {
    try {
      const { limit, sort, search, field, page } = query;
      return this.prisma.user.findMany({
        where: {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
          lastName: {
            contains: search,
            mode: "insensitive",
          },
          email: {
            contains: search,
            mode: "insensitive",
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
