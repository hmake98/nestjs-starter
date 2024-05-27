import { Body, Controller, Get, HttpStatus, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { IAuthUser } from 'src/core/interfaces/request.interface';

import {
  GetProfileResponseDto,
  UpdateProfileResponseDto,
} from '../dtos/user.response.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserService } from '../services/user.service';

@ApiTags('user.users')
@Controller({
  version: '1',
  path: '/users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: GetProfileResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Get('profile')
  public getProfile(
    @AuthUser() user: IAuthUser,
  ): Promise<GetProfileResponseDto> {
    return this.userService.getProfile(user.userId);
  }

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: UpdateProfileResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Put()
  public update(
    @AuthUser() user: IAuthUser,
    @Body() payload: UserUpdateDto,
  ): Promise<UpdateProfileResponseDto> {
    return this.userService.updateUser(user.userId, payload);
  }
}
