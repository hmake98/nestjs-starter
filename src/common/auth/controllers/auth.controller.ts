import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.request.decorator';
import { AuthService } from '../services/auth.service';
import { UserLoginDto } from '../dtos/login.dto';
import { UserCreateDto } from '../dtos/signup.dto';

@Controller()
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
}
