import { InjectQueue } from '@nestjs/bull';
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Queue } from 'bull';
import { UserUpdateDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { Repository } from 'typeorm';
import { utils } from '../../utils/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async update(id: number, data: UserUpdateDto) {
    const { email, firstName, lastName, profile, password } = data;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
    }
    const result = await this.userRepository.update(
      {
        id,
      },
      {
        email: email.trim(),
        password: utils.createHash(password),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        profile,
      },
    );
    return result.raw;
  }
}
