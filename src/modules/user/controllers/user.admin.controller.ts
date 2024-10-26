import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { AllowedRoles } from 'src/common/request/decorators/request.role.decorator';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import { UserAdminDeleteDoc } from '../docs/user.admin.doc';
import { UserService } from '../services/user.service';

@ApiTags('admin.user')
@Controller({
    path: '/admin/user',
    version: '1',
})
export class UserAdminController {
    constructor(private readonly userService: UserService) {}

    @UserAdminDeleteDoc()
    @AllowedRoles([Role.ADMIN])
    @Delete(':id')
    public async deleteUser(
        @Param('id') userId: string
    ): Promise<ApiGenericResponseDto> {
        return this.userService.deleteUser(userId);
    }
}
