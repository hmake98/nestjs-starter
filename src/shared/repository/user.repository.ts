import { User } from '../../database/entities';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findUserAccountByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
