import { Controller, Delete, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { DocErrors, DocGenericResponse, DocResponse } from 'src/core/decorators/response.decorator';
import { AllowedRoles } from 'src/core/decorators/role.decorator';
import { ApiGenericResponseDto } from 'src/core/dtos/response.dto';

import { UserService } from '../services/user.service';

@ApiTags('admin.users')
@Controller({
  version: '1',
  path: '/admin/users',
})
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Delete user' })
  @AllowedRoles([Role.ADMIN])
  @DocGenericResponse()
  @DocErrors([HttpStatus.NOT_FOUND])
  @Delete(':id')
  public async deleteUser(@Param('id') userId: string): Promise<ApiGenericResponseDto> {
    return this.userService.deleteUser(userId);
  }
}
