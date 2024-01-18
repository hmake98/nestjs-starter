import { User } from '@prisma/client';
import { UserUpdateDto } from '../dtos/user.update.dto';

export interface IUserService {
  updateUser(userId: string, data: UserUpdateDto): Promise<User>;
  me(userId: string): Promise<User>;
}
