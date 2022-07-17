import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SuccessResponse } from 'src/shared';
import { Role, User } from '@prisma/client';
import { ListUsersDto } from './dto';
import { Roles } from 'src/core';

@ApiBearerAuth()
@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  public constructor(private readonly adminService: AdminService) { }

  @Roles(Role.ADMIN)
  @Get('users/list')
  public async list(@Query() query: ListUsersDto): Promise<User[]> {
    return this.adminService.list(query);
  }

  @Roles(Role.ADMIN)
  @Delete('users/delete')
  public async deleteUsers(@Body() data: { ids: number[] }): Promise<SuccessResponse> {
    return this.adminService.deleteMultiple(data);
  }
}
