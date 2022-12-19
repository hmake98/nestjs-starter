import { Body, Controller, HttpCode, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/database/models';
import { AuthResponse } from 'src/shared';
import { UserCreateDto, UserLoginDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('login')
  public async login(@Body() data: UserLoginDto): Promise<AuthResponse> {
    return this.userService.login(data);
  }

  @HttpCode(200)
  @Post('signup')
  public async signup(@Body() data: UserCreateDto): Promise<AuthResponse> {
    return this.userService.signup(data);
  }

  @HttpCode(200)
  @Put('update/:id')
  public async update(
    @Param('id') id: number,
    @Body() data: UserUpdateDto,
  ): Promise<User> {
    return this.userService.update(id, data);
  }
}
