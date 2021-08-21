import { HttpException, HttpStatus, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Errors } from 'src/common/errors';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { UserRepository } from '../../shared/repository';
import { UserLoginDto } from './dto/user-login.dto';
import { handleError, createHash } from './../../utils/utils';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository, private readonly tokenService: TokenService) {}

  public async login(data: UserLoginDto): Promise<AuthToken> {
    try {
      const { email, password } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (!checkUser) {
        throw new NotFoundException(Errors.ErrorMessages.USER_NOT_FOUND);
      }
      if (checkUser.password !== password) {
        throw new BadRequestException(Errors.ErrorMessages.INVALID_PASSWORD);
      }
      return await this.tokenService.generateNewTokens(checkUser);
    } catch (e) {
      handleError(e);
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthToken> {
    try {
      const { email, password, firstname, lastname } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (checkUser) {
        throw new BadRequestException(Errors.ErrorMessages.USER_EXISTS);
      }
      const hashPassword = createHash(password);
      const user = await this.userRepo.create({
        email: data.email,
        password: hashPassword,
        firstName: firstname.trim(),
        lastName: lastname.trim(),
      });
      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      handleError(e);
    }
  }

  public async getToken(refreshToken: string): Promise<AuthToken> {
    try {
      const match = await this.tokenService.verify(refreshToken);
      if (!match) {
        throw new BadRequestException({ message: Errors.ErrorMessages.INVALID_TOKEN });
      }
      const user = await this.userRepo.findOne({ id: match.id });
      if (!user) {
        throw new BadRequestException({ message: Errors.ErrorMessages.USER_NOT_FOUND });
      }
      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PARTIAL_CONTENT);
    }
  }
}
