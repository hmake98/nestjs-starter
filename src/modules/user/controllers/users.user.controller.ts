import { Body, Controller, Get, HttpStatus, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { IAuthUser } from 'src/core/interfaces/request.interface';

import { GetProfileResponseDto, UpdateProfileResponseDto } from '../dtos/user.response.dto';
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
  @ApiOperation({ summary: 'Get user profile' })
  @DocResponse({
    serialization: GetProfileResponseDto,
    httpStatus: HttpStatus.OK,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Get('profile')
  public async getProfile(@AuthUser() user: IAuthUser): Promise<GetProfileResponseDto> {
    return this.userService.getProfile(user.userId);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Update user' })
  @DocResponse({
    serialization: UpdateProfileResponseDto,
    httpStatus: HttpStatus.OK,
  })
  @DocErrors([HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST])
  @Put()
  public async update(
    @AuthUser() user: IAuthUser,
    @Body() payload: UserUpdateDto,
  ): Promise<UpdateProfileResponseDto> {
    return this.userService.updateUser(user.userId, payload);
  }
}
