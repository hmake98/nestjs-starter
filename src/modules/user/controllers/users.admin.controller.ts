import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';

import { AllowedRoles } from 'src/core/decorators/role.decorator';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { GenericResponseDto } from 'src/core/dtos/response.dto';

import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserService } from '../services/user.service';
import { UpdateProfileResponseDto } from '../dtos/user.response.dto';

@ApiTags('admin.users')
@Controller({
  version: '1',
  path: '/admin/users',
})
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('accessToken')
  @AllowedRoles([Roles.ADMIN])
  @DocResponse({
    serialization: GenericResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Delete(':id')
  public deleteUser(@Param('id') userId: string): Promise<GenericResponseDto> {
    return this.userService.deleteUser(userId);
  }

  @ApiBearerAuth('accessToken')
  @AllowedRoles([Roles.ADMIN])
  @DocResponse({
    serialization: UpdateProfileResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Put(':id')
  public update(
    @Param('id') userId: string,
    @Body() payload: UserUpdateDto,
  ): Promise<UpdateProfileResponseDto> {
    return this.userService.updateUser(userId, payload);
  }
}
