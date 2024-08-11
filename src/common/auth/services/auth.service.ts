import { faker } from '@faker-js/faker';
import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Queue } from 'bull';

import { ENUM_BULL_QUEUES, ENUM_EMAIL_TEMPLATES } from 'src/app/app.constant';
import { PrismaService } from 'src/common/database/services/prisma.service';
import {
  ISendEmailBasePayload,
  IWelcomeEmailDataPaylaod,
} from 'src/common/helper/interfaces/email.interface';

import { IAuthUser } from '../../../core/interfaces/request.interface';
import { HelperEncryptionService } from '../../helper/services/helper.encryption.service';
import { UserLoginDto } from '../dtos/auth.login.dto';
import { AuthRefreshResponseDto, AuthResponseDto } from '../dtos/auth.response.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { IAuthService } from '../interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly helperEncryptionService: HelperEncryptionService,
    @InjectQueue(ENUM_BULL_QUEUES.EMAIL)
    private emailQueue: Queue,
  ) {}

  public async login(data: UserLoginDto): Promise<AuthResponseDto> {
    try {
      const { email, password } = data;

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new HttpException('user.errors.userNotFound', HttpStatus.NOT_FOUND);
      }

      const passwordMatched = await this.helperEncryptionService.match(user.password, password);

      if (!passwordMatched) {
        throw new HttpException('auth.errors.invalidPassword', HttpStatus.BAD_REQUEST);
      }

      const tokens = await this.helperEncryptionService.createJwtTokens({
        role: user.role,
        userId: user.id,
      });

      return {
        ...tokens,
        user,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthResponseDto> {
    try {
      const { email, firstName, lastName, password } = data;

      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new HttpException('user.errors.userExists', HttpStatus.CONFLICT);
      }

      const hashed = await this.helperEncryptionService.createHash(password);

      const createdUser = await this.prismaService.user.create({
        data: {
          email,
          password: hashed,
          firstName: firstName?.trim(),
          lastName: lastName?.trim(),
          role: Role.USER,
          userName: faker.internet.userName(),
        },
      });

      const tokens = await this.helperEncryptionService.createJwtTokens({
        role: createdUser.role,
        userId: createdUser.id,
      });

      this.emailQueue.add(
        ENUM_EMAIL_TEMPLATES.WELCOME_EMAIL,
        {
          data: {
            userName: createdUser.userName,
          },
          toEmails: [email],
        } as ISendEmailBasePayload<IWelcomeEmailDataPaylaod>,
        { delay: 15000 },
      );

      return {
        ...tokens,
        user: createdUser,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async refreshTokens(payload: IAuthUser): Promise<AuthRefreshResponseDto> {
    return this.helperEncryptionService.createJwtTokens({
      userId: payload.userId,
      role: payload.role,
    });
  }
}
