import { Body, ClassSerializerInterceptor, Controller, UseInterceptors, Delete, Get, Query, Put, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { SuccessResponse } from "src/shared";
import { CreateUserDto, ListUsersDto, UpdateUsersDto } from "./dto";
import { Roles } from "src/core";
import { DeleteUsersDto } from "./dto/user/user-delete.dto";
import { I18n, I18nContext } from "nestjs-i18n";

@ApiBearerAuth()
@Controller("admin")
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  public constructor(private readonly adminService: AdminService) {}

  @Roles('ADMIN')
  @Get("users")
  public async list(@Query() query: ListUsersDto): Promise<void> {
    return this.adminService.list(query);
  }

  @Roles('ADMIN')
  @Delete("users")
  public async deleteUsers(@Body() data: DeleteUsersDto, @I18n() i18n: I18nContext): Promise<SuccessResponse> {
    return this.adminService.deleteMultiple(i18n, data);
  }

  @Roles('ADMIN')
  @Put("user")
  public async updateUser(@Body() data: UpdateUsersDto): Promise<void> {
    return this.adminService.update(data);
  }

  @Roles('ADMIN')
  @Post("users")
  public async create(@Body() data: CreateUserDto): Promise<void> {
    return this.adminService.createUser(data);
  }
}
