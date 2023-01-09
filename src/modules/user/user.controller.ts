import { Body, Controller, Param, Put } from '@nestjs/common';
import { UserUpdateDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':id')
  public update(@Param('id') id: number, @Body() payload: UserUpdateDto) {
    this.userService.update(id, payload);
  }
}
