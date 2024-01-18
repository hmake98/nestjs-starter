import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../interfaces/auth.service.interface';
import { UserLoginDto } from '../dtos/login.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { UserCreateDto } from '../dtos/signup.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async login(data: UserLoginDto) {
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
      throw new Error(e);
    }
  }

  async signup(data: UserCreateDto) {
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
      const accessToken = this.jwtService.sign({
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
}
