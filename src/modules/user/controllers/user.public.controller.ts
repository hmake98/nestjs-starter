import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiEndpoint } from 'src/common/doc/decorators/doc.api-endpoint.decorator';
import { AuthUser } from 'src/common/request/decorators/auth-user.decorator';
import type { IAuthUser } from 'src/common/request/interfaces/request.interface';

import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
} from '../dtos/user.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserService } from '../services/user.service';

@ApiTags('public.user')
@ApiBearerAuth('accessToken')
@Controller({ path: '/user', version: '1' })
export class UserPublicController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @ApiEndpoint({
        summary: 'Get user profile',
        serialization: UserGetProfileResponseDto,
        messageKey: 'user.success.profile',
    })
    getProfile(
        @AuthUser() user: IAuthUser
    ): Promise<UserGetProfileResponseDto> {
        return this.userService.getProfile(user.userId);
    }

    @Put()
    @ApiEndpoint({
        summary: 'Update user profile',
        serialization: UserUpdateProfileResponseDto,
        messageKey: 'user.success.updated',
    })
    updateUser(
        @AuthUser() user: IAuthUser,
        @Body() payload: UserUpdateDto
    ): Promise<UserUpdateProfileResponseDto> {
        return this.userService.updateUser(user.userId, payload);
    }
}
