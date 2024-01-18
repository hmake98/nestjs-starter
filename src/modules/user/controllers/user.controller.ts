import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { UserUpdateDto } from '../dtos/user.update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  public me(@AuthUser() userId: string) {
    return this.userService.me(userId);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() payload: UserUpdateDto) {
    return this.userService.updateUser(id, payload);
  }
}
