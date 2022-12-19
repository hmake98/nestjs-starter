import { InjectQueue } from '@nestjs/bull';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { User } from 'src/database/models';
import { AuthResponse, Role, TokenService } from 'src/shared';
import { helpers } from 'src/utils/helpers';
import { UserCreateDto, UserLoginDto, UserUpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private tokenService: TokenService,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  public async login(data: UserLoginDto): Promise<AuthResponse> {
    try {
      const { email, password } = data;
      const checkUser = await this.userRepository.findOne({ where: { email } });
      if (!checkUser) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      if (!helpers.match(checkUser.password, password)) {
        throw new HttpException(
          'auth.invalid_password',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.tokenService.generateResponse(checkUser);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthResponse> {
    try {
      const { email, password, firstName, lastName } = data;
      const checkUser = await this.userRepository.findOne({ where: { email } });
      if (checkUser) {
        throw new HttpException('userExists', HttpStatus.CONFLICT);
      }
      const hashPassword = helpers.createHash(password);
      const user = await this.userRepository.create({
        email: data.email.trim(),
        password: hashPassword,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: Role.User,
      });
      this.notificationQueue.add({ message: 'Welcome User!' });
      return this.tokenService.generateResponse(user);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async update(id: number, data: UserUpdateDto): Promise<User> {
    try {
      const { email, firstName, lastName, profile } = data;
      const checkUser = await this.userRepository.findOne({ where: { email } });
      if (!checkUser) {
        throw new HttpException('userNotFound', HttpStatus.CONFLICT);
      }
      const result = await this.userRepository.update(
        {
          first_name: firstName?.trim(),
          last_name: lastName?.trim(),
          email: email?.trim(),
          profile,
        },
        {
          where: { id },
          returning: true,
        },
      );
      const user = result[1][0];
      delete user.dataValues.password;
      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
