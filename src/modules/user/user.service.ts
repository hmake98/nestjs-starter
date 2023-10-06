import { InjectQueue } from '@nestjs/bull';
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Queue } from 'bull';
import { UserCreateDto, UserLoginDto, UserUpdateDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { helpers } from '../../utils/helpers';
import { User } from '../../common/database/entities';
import { AuthService } from '../../common/auth/auth.service';
import { Queues } from 'src/utils/util';
import { AuthResponse } from 'src/shared/interfaces/response.interface';
import { UserRoles } from 'src/common/database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectQueue(Queues.notification) private notificationQueue: Queue,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async login(data: UserLoginDto): Promise<AuthResponse> {
    try {
      const { email, password } = data;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      const match = helpers.match(user.password, password);
      if (!match) {
        throw new HttpException('invalidPassword', HttpStatus.NOT_FOUND);
      }
      const accessToken = this.authService.generateToken({
        role: user.role,
        userId: user.id,
      });
      return {
        accessToken,
        user,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthResponse> {
    try {
      const { email, firstName, lastName, password } = data;
      const user = await this.userRepository.findOneBy({ email });
      if (user) {
        throw new HttpException('userExists', HttpStatus.CONFLICT);
      }
      const create = await this.userRepository.save({
        email,
        password: helpers.createHash(password),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: UserRoles.USER,
      });
      const accessToken = this.authService.generateToken({
        role: create.role,
        userId: create.id,
      });
      return {
        accessToken,
        user: create,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async me(id: number): Promise<User> {
    return this.userRepository.findOneBy({
      id,
    });
  }

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
        password: helpers.createHash(password),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        profile,
      },
    );
    return result.raw;
  }
}
