import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRole } from '../../types';
import { UserCreateDto, UserLoginDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { Repository } from 'typeorm';
import { helpers } from '../../utils/helpers';
import { AuthResponse } from '../../types/index';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtStrategy,
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
      const accessToken = this.jwt.generateToken({
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
        role: UserRole.USER,
      });
      const accessToken = this.jwt.generateToken({
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
}
