import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "src/shared/services/config.service";
import { CreateUserDto, ListUsersDto } from "./dto";
import { SuccessResponse } from "src/shared";
import { UpdateUsersDto } from "./dto/user/user-update.dto";
import { DeleteUsersDto } from "./dto/user/user-delete.dto";
import { I18nContext } from "nestjs-i18n";

@Injectable()
export class AdminService {
  public limit: number;
  public skip: number;

  constructor(private readonly configService: ConfigService) {
    this.limit = this.configService.get("limit");
    this.skip = this.configService.get("skip");
  }

  public async update(users: UpdateUsersDto): Promise<void> {}

  public async deleteMultiple(context: I18nContext, data: DeleteUsersDto): Promise<SuccessResponse> {
    try {
      const { ids } = data;
      const message = await context.translate("user.user_deleted_success", { lang: context.lang });
      return { status: true, message };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async createUser(data: CreateUserDto): Promise<void> {
    const { email, firstName, lastName, phone, password } = data;
  }

  public async list(query: ListUsersDto): Promise<void> {
    try {
      const { limit, sort, search, field, page } = query;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
