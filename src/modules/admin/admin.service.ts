import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { UserRepository } from '../../shared/repository/user.repository';
import { AdminCreateDto } from './dto/admin-create.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { createHash, match } from 'src/utils/helper';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities';

@Injectable()
export class AdminService {
  public limit: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService,
  ) {
    this.limit = this.configService.get('limit');
  }

  public async login(data: AdminLoginDto): Promise<AuthToken> {
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

  public async signup(data: AdminCreateDto): Promise<AuthToken> {
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
      newUser.role = Role.ADMIN;
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
