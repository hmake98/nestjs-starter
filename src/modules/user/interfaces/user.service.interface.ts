import { ApiGenericResponseDto } from 'src/core/dtos/response.dto';

import { GetProfileResponseDto, UpdateProfileResponseDto } from '../dtos/user.response.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';

export interface IUserService {
  updateUser(userId: string, data: UserUpdateDto): Promise<UpdateProfileResponseDto>;
  deleteUser(userId: string): Promise<ApiGenericResponseDto>;
  getProfile(userId: string): Promise<GetProfileResponseDto>;
}
