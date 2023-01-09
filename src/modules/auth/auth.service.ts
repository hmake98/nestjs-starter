import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRole } from '../../types';
import { UserCreateDto, UserLoginDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { Repository } from 'typeorm';
import { utils } from '../../utils/helpers';
import { AuthResponse } from '../../types/index';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtStrategy,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async login(data: UserLoginDto): Promise<AuthResponse> {
    const { email, password } = data;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
    }
    const match = utils.match(user.password, password);
    if (!match) {
      throw new HttpException('invalidPassword', HttpStatus.NOT_FOUND);
    }
    const accessToken = this.jwt.generateToken({
      role: user.role,
      sub: user.id,
    });
    return {
      accessToken,
      user,
    };
  }

  public async signup(data: UserCreateDto): Promise<AuthResponse> {
    const { email, firstName, lastName, password } = data;
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new HttpException('userExists', HttpStatus.CONFLICT);
    }
    const create = await this.userRepository.save({
      email,
      password: utils.createHash(password),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      role: UserRole.USER,
    });
    console.log(create);
    const accessToken = this.jwt.generateToken({
      role: create.role,
      sub: create.id,
    });
    return {
      accessToken,
      user: create,
    };
  }
}
