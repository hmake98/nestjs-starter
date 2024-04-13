import { Users } from '@prisma/client';
import { UserUpdateDto } from '../dtos/user.update.dto';

export interface IUserService {
  updateUser(userId: string, data: UserUpdateDto): Promise<Users>;
  getProfile(userId: string): Promise<Users>;
}
