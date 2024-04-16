import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowedRoles } from 'src/core/decorators/role.decorator';
import { Roles } from '@prisma/client';
import {
  DeleteProfileResponseDto,
  UpdateProfileAdminResponseDto,
} from '../dtos/user.response.dto';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';

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
    serialization: DeleteProfileResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Delete(':id')
  public deleteUser(
    @Param('id') userId: string,
  ): Promise<DeleteProfileResponseDto> {
    return this.userService.deleteUser(userId);
  }

  @ApiBearerAuth('accessToken')
  @AllowedRoles([Roles.ADMIN])
  @DocResponse({
    serialization: UpdateProfileAdminResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Put(':id')
  public update(
    @Param('id') userId: string,
    @Body() payload: UserUpdateDto,
  ): Promise<UpdateProfileAdminResponseDto> {
    return this.userService.updateUser(userId, payload);
  }
}
