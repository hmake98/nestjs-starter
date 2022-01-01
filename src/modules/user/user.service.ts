import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { UserRepository } from '../../shared/repository';
import { UserLoginDto } from './dto/user-login.dto';
import { createHash } from '../../utils/helper';
import { UserCreateDto } from './dto/user-create.dto';
import { User } from 'src/database/entities';
import { match } from '../../utils/helper';
import { Role } from '../../database/entities/role.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository, private readonly tokenService: TokenService) {}

  public async login(data: UserLoginDto): Promise<AuthToken> {
    try {
      const { email, password } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (!checkUser) {
        throw new HttpException('USER_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }
      if (!match(checkUser.password, password)) {
        throw new HttpException('INVALID_PASSWORD', HttpStatus.CONFLICT);
      }
      return await this.tokenService.generateNewTokens(checkUser);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthToken> {
    try {
      const { email, password, firstname, lastname } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (checkUser) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const hashPassword = createHash(password);
      const newUser = new User();
      newUser.email = data.email;
      newUser.password = hashPassword;
      newUser.firstName = firstname.trim();
      newUser.lastName = lastname.trim();
      newUser.role = Role.USER;
      const user = await this.userRepo.save(newUser);
      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async getToken(refreshToken: string): Promise<AuthToken> {
    try {
      const match = await this.tokenService.verify(refreshToken);
      if (!match) {
        throw new BadRequestException();
      }
      const user = await this.userRepo.findOne({ id: match.id });
      if (!user) {
        throw new BadRequestException();
      }
      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PARTIAL_CONTENT);
    }
  }
}
