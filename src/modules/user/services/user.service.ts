import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cached, InvalidateTags } from '@nestjs-redisx/cache';

import { UserEntity } from 'src/common/database/interfaces/user.interface';
import { UserRepository } from 'src/common/database/repositories/user.repository';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
} from '../dtos/user.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';

const USER_TAGS = ['user:{0}'];

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getProfile(userId: string): Promise<UserGetProfileResponseDto> {
        const user = await this.findById(userId);
        if (!user) {
            throw new HttpException(
                'user.error.userNotFound',
                HttpStatus.NOT_FOUND
            );
        }
        return user;
    }

    @InvalidateTags({ tags: USER_TAGS })
    async updateUser(
        userId: string,
        data: UserUpdateDto
    ): Promise<UserUpdateProfileResponseDto> {
        await this.assertExists(userId);
        return this.userRepository.update(userId, data);
    }

    @InvalidateTags({ tags: USER_TAGS })
    async deleteUser(userId: string): Promise<ApiGenericResponseDto> {
        await this.assertExists(userId);
        await this.userRepository.softDelete(userId);
        return { success: true, message: 'user.success.userDeleted' };
    }

    @Cached({ key: 'user:profile:{0}', ttl: 60, tags: USER_TAGS })
    private async findById(userId: string): Promise<UserEntity | null> {
        return this.userRepository.findById(userId);
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
