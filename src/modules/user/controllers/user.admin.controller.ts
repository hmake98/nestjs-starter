import { Controller, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserRole } from 'src/common/database/enums/role.enum';
import { ApiEndpoint } from 'src/common/doc/decorators/doc.api-endpoint.decorator';
import { AllowedRoles } from 'src/common/request/decorators/roles.decorator';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import { UserService } from '../services/user.service';

@ApiTags('admin.user')
@ApiBearerAuth('accessToken')
@AllowedRoles([UserRole.ADMIN])
@Controller({ path: '/admin/user', version: '1' })
export class UserAdminController {
    constructor(private readonly userService: UserService) {}

    @Delete(':id')
    @ApiEndpoint({
        summary: 'Delete user',
        messageKey: 'user.success.deleted',
    })
    deleteUser(@Param('id') userId: string): Promise<ApiGenericResponseDto> {
        return this.userService.deleteUser(userId);
    }
}
