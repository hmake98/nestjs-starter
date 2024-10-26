import { HttpStatus, Injectable, HttpException } from '@nestjs/common';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import { UserUpdateDto } from '../dtos/request/user.update.request';
import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
} from '../dtos/response/user.response';
import { IUserService } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
    constructor(private readonly prismaService: PrismaService) {}

    async updateUser(
        userId: string,
        data: UserUpdateDto
    ): Promise<UserUpdateProfileResponseDto> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }
            const updatedUser = await this.prismaService.user.update({
                where: { id: userId },
                data,
            });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId: string): Promise<ApiGenericResponseDto> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }
            await this.prismaService.user.update({
                where: { id: userId },
                data: { deletedAt: new Date() },
            });

            return {
                success: true,
                message: 'user.success.userDeleted',
            };
        } catch (error) {
            throw error;
        }
    }

    async getProfile(id: string): Promise<UserGetProfileResponseDto> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new HttpException(
                'user.error.userNotFound',
                HttpStatus.NOT_FOUND
            );
        }
        return user;
    }
}
