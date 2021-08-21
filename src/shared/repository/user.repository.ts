import { Role, User } from '../../database/entities';
import { EntityRepository, Repository } from 'typeorm';
import { GetResponse } from '../interfaces';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findUserAccountByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
