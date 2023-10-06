import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserCreateDto, UserLoginDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';
import { AuthUser, Public } from 'src/core/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('login')
  public login(@Body() payload: UserLoginDto) {
    return this.userService.login(payload);
  }

  @Public()
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
