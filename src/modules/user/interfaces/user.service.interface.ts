import { GenericResponseDto } from 'src/core/dtos/response.dto';

import { UserUpdateDto } from '../dtos/user.update.dto';
import {
  GetProfileResponseDto,
  UpdateProfileResponseDto,
} from '../dtos/user.response.dto';

export interface IUserService {
  updateUser(
    userId: string,
    data: UserUpdateDto,
  ): Promise<UpdateProfileResponseDto>;
  deleteUser(userId: string): Promise<GenericResponseDto>;
  getProfile(userId: string): Promise<GetProfileResponseDto>;
}
