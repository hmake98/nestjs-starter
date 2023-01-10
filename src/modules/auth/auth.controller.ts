import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCreateDto, UserLoginDto } from './dto';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from '../../core';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  public login(@Body() payload: UserLoginDto) {
    return this.authService.login(payload);
  }

  @Public()
  @Post('signup')
  public signup(@Body() payload: UserCreateDto) {
    return this.authService.signup(payload);
  }

  @Get('me')
  public me(@CurrentUser() userId: number) {
    return this.authService.me(userId);
  }
}
