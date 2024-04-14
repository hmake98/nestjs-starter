import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  GetProfileResponseDto,
  UpdateProfileResponseDto,
} from '../dtos/user.response.dto';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';

@ApiTags('user.users')
@Controller({
  version: '1',
  path: '/users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @DocResponse({
    serialization: GetProfileResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Get('profile')
  public getProfile(
    @AuthUser() userId: string,
  ): Promise<GetProfileResponseDto> {
    return this.userService.getProfile(userId);
  }

  @DocResponse({
    serialization: UpdateProfileResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Post()
  public update(
    @AuthUser() userId: string,
    @Body() payload: UserUpdateDto,
  ): Promise<UpdateProfileResponseDto> {
    return this.userService.updateUser(userId, payload);
  }
}
