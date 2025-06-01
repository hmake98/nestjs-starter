import { Body, Controller, Get, HttpStatus, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { UserUpdateDto } from '../dtos/request/user.update.request';
import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
} from '../dtos/response/user.response';
import { UserService } from '../services/user.service';

@ApiTags('public.user')
@Controller({
    path: '/user',
    version: '1',
})
export class UserPublicController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Get user profile' })
    @DocResponse({
        serialization: UserGetProfileResponseDto,
        httpStatus: HttpStatus.OK,
        messageKey: 'user.success.profile',
    })
    public async getProfile(
        @AuthUser() user: IAuthUser
    ): Promise<UserGetProfileResponseDto> {
        return this.userService.getProfile(user.userId);
    }

    @Put()
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Update user' })
    @DocResponse({
        serialization: UserUpdateProfileResponseDto,
        httpStatus: HttpStatus.OK,
        messageKey: 'user.success.updated',
    })
    public async update(
        @AuthUser() user: IAuthUser,
        @Body() payload: UserUpdateDto
    ): Promise<UserUpdateProfileResponseDto> {
        return this.userService.updateUser(user.userId, payload);
    }
}
