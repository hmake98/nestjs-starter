import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../interfaces/auth.service.interface';
import { UserLoginDto } from '../dtos/login.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { EncryptionService } from '../../../common/helper/services/encryption.service';
import { UserCreateDto } from '../dtos/signup.dto';
import { Role } from '@prisma/client';
import { AuthResponse } from '../../../common/helper/interfaces/response.interface';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Queues } from '../../../app/app.constant';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
    @InjectQueue(Queues.WelcomeEmail) private welcomeQueue: Queue,
  ) {}

  public async login(data: UserLoginDto): Promise<AuthResponse> {
    try {
      const { email, password } = data;
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      const match = this.encryptionService.match(user.password, password);
      if (!match) {
        throw new HttpException('invalidPassword', HttpStatus.NOT_FOUND);
      }
      const accessToken = this.jwtService.sign({
        role: user.role,
        userId: user.id,
      });
      return {
        accessToken,
        user,
      };
    } catch (e) {
      throw e;
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthResponse> {
    try {
      const { email, firstName, lastName, password } = data;
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        throw new HttpException('userExists', HttpStatus.CONFLICT);
      }
      const create = await this.prismaService.user.create({
        data: {
          email,
          password: this.encryptionService.createHash(password),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role: Role.USER,
        },
      });
      this.welcomeQueue.add({ firstName, lastName, email }, { delay: 15000 });
      const accessToken = this.jwtService.sign({
        role: create.role,
        userId: create.id,
      });
      return {
        accessToken,
        user: create,
      };
    } catch (e) {
      throw e;
    }
  }
}
