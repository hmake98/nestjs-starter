import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import { UserUpdateDto } from '../dtos/request/user.update.request';
import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
} from '../dtos/response/user.response';

export interface IUserService {
    updateUser(
        userId: string,
        data: UserUpdateDto
    ): Promise<UserUpdateProfileResponseDto>;
    deleteUser(userId: string): Promise<ApiGenericResponseDto>;
    getProfile(userId: string): Promise<UserGetProfileResponseDto>;
}
