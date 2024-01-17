import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { PublicRequest } from 'src/core/decorators/public.request.decorator';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { UserLoginDto } from '../dtos/login.dto';
import { UserCreateDto } from '../dtos/signup.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRequest()
  @Post('login')
  public login(@Body() payload: UserLoginDto) {
    return this.userService.login(payload);
  }

  @PublicRequest()
  @Post('signup')
  public signup(@Body() payload: UserCreateDto) {
    return this.userService.signup(payload);
  }

  @Get('me')
  public me(@AuthUser() userId: number) {
    return this.userService.me(userId);
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() payload: UserUpdateDto) {
    this.userService.update(id, payload);
  }
}
