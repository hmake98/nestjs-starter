import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UserRole } from 'src/common/database/enums/role.enum';
import { UserRepository } from 'src/common/database/repositories/user.repository';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { UserLoginDto } from '../dtos/auth.login.dto';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
    TokenDto,
} from '../dtos/auth.response.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async login({ email, password }: UserLoginDto): Promise<AuthResponseDto> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new HttpException(
                'user.error.userNotFound',
                HttpStatus.NOT_FOUND
            );
        }

        const matched = await argon2.verify(user.passwordHash, password);
        if (!matched) {
            throw new HttpException(
                'auth.error.invalidPassword',
                HttpStatus.BAD_REQUEST
            );
        }

        const tokens = await this.signTokens({
            userId: user.id,
            role: user.role,
        });
        return { ...tokens, user };
    }

    async signup(data: UserCreateDto): Promise<AuthResponseDto> {
        if (await this.userRepository.existsByEmail(data.email)) {
            throw new HttpException(
                'user.error.userExists',
                HttpStatus.CONFLICT
            );
        }

        const hashed = await argon2.hash(data.password);
        const user = await this.userRepository.create({
            email: data.email,
            password: hashed,
            firstName: data.firstName?.trim() ?? null,
            lastName: data.lastName?.trim() ?? null,
            role: UserRole.MEMBER,
            userName: faker.internet.username(),
        });

        const tokens = await this.signTokens({
            userId: user.id,
            role: user.role,
        });
        return { ...tokens, user };
    }

    refreshTokens(payload: IAuthUser): Promise<AuthRefreshResponseDto> {
        return this.signTokens(payload);
    }

    private async signTokens(payload: IAuthUser): Promise<TokenDto> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, this.signOptions('accessToken')),
            this.jwtService.signAsync(
                payload,
                this.signOptions('refreshToken')
            ),
        ]);
        return { accessToken, refreshToken };
    }

    private signOptions(kind: 'accessToken' | 'refreshToken'): JwtSignOptions {
        return {
            secret: this.configService.getOrThrow<string>(
                `auth.${kind}.secret`
            ),
            expiresIn: this.configService.getOrThrow<string>(
                `auth.${kind}.tokenExp`
            ),
        } as JwtSignOptions;
    }
}
