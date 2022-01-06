import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  HttpCode,
  Put,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthToken } from 'src/shared/interfaces';
import { User } from 'src/database/entities';
import { AdminCreateDto, AdminLoginDto, AdminUpdateDto, ListUsersDto } from './dto';
import { DeleteResult } from 'typeorm';

@ApiBearerAuth()
@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  public constructor(private readonly adminService: AdminService) {}

  @HttpCode(200)
  @Post('/signup')
  public async signup(@Body() data: AdminCreateDto): Promise<AuthToken> {
    return this.adminService.signup(data);
  }

  @HttpCode(200)
  @Post('/login')
  public async login(@Body() data: AdminLoginDto): Promise<AuthToken> {
    return this.adminService.login(data);
  }

  @HttpCode(200)
  @Put('users/update/:id')
  public async update(@Param('id') id: number, @Body() data: AdminUpdateDto): Promise<User> {
    return this.adminService.update(id, data);
  }

  @HttpCode(200)
  @Delete('users/delete/:id')
  public async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.adminService.delete(id);
  }

  @HttpCode(200)
  @Get('users/list')
  public async list(@Query() query: ListUsersDto): Promise<User[]> {
    return this.adminService.list(query);
  }
}
