import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ILike, FindOperator, DeleteResult } from 'typeorm';
import { ConfigService } from 'src/config/config.service';
import { UserRepository } from '../../shared/repository';
import { AdminCreateDto, AdminLoginDto, AdminUpdateDto, ListUsersDto } from './dto';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { Role, User } from 'src/database/entities';
import { helpers } from 'src/utils/helper';

@Injectable()
export class AdminService {
  private limit: number;
  private skip: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService,
  ) {
    this.limit = this.configService.get('limit');
    this.skip = this.configService.get('skip');
  }

  public async login(data: AdminLoginDto): Promise<AuthToken> {
    try {
      const { email, password } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (!checkUser) {
        throw new HttpException('USER_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }
      if (!helpers.match(checkUser.password, password)) {
        throw new HttpException('INVALID_PASSWORD', HttpStatus.CONFLICT);
      }
      return await this.tokenService.generateNewTokens(checkUser);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async signup(data: AdminCreateDto): Promise<AuthToken> {
    try {
      const { email, password, firstName, lastName } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (checkUser) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const newUser = {} as AdminCreateDto;
      const hashPassword = helpers.createHash(password);
      newUser.email = data.email;
      newUser.password = hashPassword;
      newUser.firstName = firstName.trim();
      newUser.lastName = lastName.trim();
      newUser.role = Role.ADMIN;
      const user = await this.userRepo.createUser(newUser);
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

  public async update(id: number, data: AdminUpdateDto): Promise<User> {
    try {
      return await this.userRepo.updateUserById(id, data);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async delete(id: number): Promise<DeleteResult> {
    try {
      return await this.userRepo.deleteUserById(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async list(query: ListUsersDto): Promise<User[]> {
    try {
      const { limit, sort, search, field, page } = query;
      type searchQuery = {
        order: {
          [field: string]: string;
        };
        take: number;
        skip: number;
        where: {
          role: Role;
          email?: FindOperator<string>;
        };
      };
      const searchQuery = {} as searchQuery;
      searchQuery.order = sort ? { [field]: `${sort.toUpperCase()}` } : null || { id: 'DESC' };
      searchQuery.take = limit || this.limit;
      searchQuery.skip = (page - 1) * searchQuery.take || this.skip;
      searchQuery.where = search ? { email: ILike(`%${search}%`), role: Role.USER } : null || { role: Role.USER };
      return await this.userRepo.getAllUsers(searchQuery);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
