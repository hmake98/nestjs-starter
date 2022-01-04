import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors, HttpCode } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthToken } from 'src/shared/interfaces';
import { AdminCreateDto } from '../admin/dto/admin-create.dto';
import { AdminLoginDto } from '../admin/dto/admin-login.dto';

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
}
