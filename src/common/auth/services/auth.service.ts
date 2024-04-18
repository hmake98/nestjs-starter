import { Queue } from 'bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { IAuthService } from '../interfaces/auth.service.interface';
import { UserLoginDto } from '../dtos/auth.login.dto';
import { PrismaService } from '../../helper/services/prisma.service';
import { EncryptionService } from '../../../common/helper/services/encryption.service';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { BullQueues } from 'src/common/notification/constants/notification.constants';
import { EmailTemplates } from 'src/common/notification/constants/notification.enum';
import {
  AuthRefreshResponseDto,
  AuthResponseDto,
} from '../dtos/auth.response.dto';
import { IAuthUser } from 'src/core/interfaces/request.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
    @InjectQueue(BullQueues.EMAIL_QUEUE)
    private emailQueue: Queue,
  ) {}

  public async login(data: UserLoginDto): Promise<AuthResponseDto> {
    try {
      const { email, password } = data;
      const user = await this.prismaService.users.findUnique({
        where: { email },
      });
      if (!user) {
        throw new HttpException('users.userNotFound', HttpStatus.NOT_FOUND);
      }
      const match = this.encryptionService.match(user.password, password);
      if (!match) {
        throw new HttpException('auth.invalidPassword', HttpStatus.NOT_FOUND);
      }
      const tokens = await this.encryptionService.createJwtTokens({
        role: user.role,
        userId: user.id,
      });
      return {
        ...tokens,
        user,
      };
    } catch (e) {
      throw e;
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthResponseDto> {
    try {
      const { email, firstName, lastName, password } = data;
      const user = await this.prismaService.users.findUnique({
        where: { email },
      });
      if (user) {
        throw new HttpException('users.userExists', HttpStatus.CONFLICT);
      }
      const createdUser = await this.prismaService.users.create({
        data: {
          email,
          password: this.encryptionService.createHash(password),
          first_name: firstName?.trim(),
          last_name: lastName?.trim(),
          role: Roles.USER,
        },
      });
      this.emailQueue.add(
        EmailTemplates.WELCOME_EMAIL,
        {
          data: {
            email,
            firstName,
            lastName,
          },
          email,
        },
        { delay: 15000 },
      );
      const tokens = await this.encryptionService.createJwtTokens({
        role: createdUser.role,
        userId: createdUser.id,
      });
      return {
        ...tokens,
        user: createdUser,
      };
    } catch (e) {
      throw e;
    }
  }

  public async refreshTokens(
    payload: IAuthUser,
  ): Promise<AuthRefreshResponseDto> {
    const tokens = await this.encryptionService.createJwtTokens({
      userId: payload.userId,
      role: payload.role,
    });
    return tokens;
  }
}
