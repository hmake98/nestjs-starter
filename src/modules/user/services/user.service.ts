import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserRepository } from 'src/common/database/repositories/user.repository';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
} from '../dtos/user.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getProfile(userId: string): Promise<UserGetProfileResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new HttpException(
                'user.error.userNotFound',
                HttpStatus.NOT_FOUND
            );
        }
        return user;
    }

    async updateUser(
        userId: string,
        data: UserUpdateDto
    ): Promise<UserUpdateProfileResponseDto> {
        await this.assertExists(userId);
        return this.userRepository.update(userId, data);
    }

    async deleteUser(userId: string): Promise<ApiGenericResponseDto> {
        await this.assertExists(userId);
        await this.userRepository.softDelete(userId);
        return { success: true, message: 'user.success.userDeleted' };
    }

    private async assertExists(userId: string): Promise<void> {
        const exists = await this.userRepository.existsById(userId);
        if (!exists) {
            throw new HttpException(
                'user.error.userNotFound',
                HttpStatus.NOT_FOUND
            );
        }
    }
}
