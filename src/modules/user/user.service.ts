import { ConfigService } from 'src/config/config.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { UserCreateDto, UserUpdateDto, UserLoginDto } from './dto';
import { helpers } from 'src/utils/helper';
import { PrismaService } from 'src/shared';
import { Role, User } from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UserService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  public async login(data: UserLoginDto): Promise<AuthToken> {
    try {
      const { email, password } = data;
      const checkUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
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

  public async signup(data: UserCreateDto): Promise<AuthToken> {
    try {
      const { email, password, firstName, lastName } = data;
      const checkUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (checkUser) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const newUser = {} as User;
      const hashPassword = helpers.createHash(password);
      newUser.email = data.email;
      newUser.password = hashPassword;
      newUser.firstName = firstName.trim();
      newUser.lastName = lastName.trim();
      newUser.role = Role.USER;
      const user = await this.prisma.user.create({
        data: newUser,
      });
      this.notificationQueue.add({ message: 'Welcome!' });
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
      const user = await this.prisma.user.findUnique({ where: { id: match.id } });
      if (!user) {
        throw new BadRequestException();
      }
      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PARTIAL_CONTENT);
    }
  }

  public async update(id: number, data: UserUpdateDto): Promise<User> {
    try {
      const { email, firstName, lastName, phone, userProfile } = data;
      return await this.prisma.user.update({
        data: {
          email,
          firstName,
          lastName,
          phone,
          userProfile,
        },
        where: {
          id,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
