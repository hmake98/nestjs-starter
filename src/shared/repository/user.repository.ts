import { User } from '../../database/entities';
import { EntityRepository, Repository } from 'typeorm';
import { UserUpdateDto } from 'src/modules/user/dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findUserAccountByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  public async updateUserById(id: number, data: UserUpdateDto): Promise<User> {
    return await this.save({
      id: id,
      ...data,
    });
  }

  public async deleteUserById(id: number): Promise<any> {
    return await this.delete({ id });
  }

  public async getAllUsers(searchQuery: any): Promise<User[]> {
    return await this.find(searchQuery);
  }
}
