import { faker } from '@faker-js/faker';
import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Queue } from 'bull';

import { APP_BULL_QUEUES } from 'src/app/enums/app.enum';
import { AWS_SES_EMAIL_TEMPLATES } from 'src/common/aws/enums/aws.ses.enum';
import { DatabaseService } from 'src/common/database/services/database.service';
import {
    ISendEmailBasePayload,
    IWelcomeEmailDataPaylaod,
} from 'src/common/helper/interfaces/email.interface';

import { HelperEncryptionService } from '../../helper/services/helper.encryption.service';
import { IAuthUser } from '../../request/interfaces/request.interface';
import { UserLoginDto } from '../dtos/request/auth.login.dto';
import { UserCreateDto } from '../dtos/request/auth.signup.dto';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
} from '../dtos/response/auth.response.dto';
import { IAuthService } from '../interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly helperEncryptionService: HelperEncryptionService,
        @InjectQueue(APP_BULL_QUEUES.EMAIL)
        private emailQueue: Queue
    ) {}

    public async login(data: UserLoginDto): Promise<AuthResponseDto> {
        try {
            const { email, password } = data;

            const user = await this.databaseService.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            const passwordMatched = await this.helperEncryptionService.match(
                user.password,
                password
            );

            if (!passwordMatched) {
                throw new HttpException(
                    'auth.error.invalidPassword',
                    HttpStatus.BAD_REQUEST
                );
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
            throw error;
        }
    }

    public async signup(data: UserCreateDto): Promise<AuthResponseDto> {
        try {
            const { email, firstName, lastName, password } = data;

            const existingUser = await this.databaseService.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new HttpException(
                    'user.error.userExists',
                    HttpStatus.CONFLICT
                );
            }

            const hashed =
                await this.helperEncryptionService.createHash(password);

            const createdUser = await this.databaseService.user.create({
                data: {
                    email,
                    password: hashed,
                    firstName: firstName?.trim(),
                    lastName: lastName?.trim(),
                    role: Role.USER,
                    userName: faker.internet.username(),
                },
            });

            const tokens = await this.helperEncryptionService.createJwtTokens({
                role: createdUser.role,
                userId: createdUser.id,
            });

            this.emailQueue.add(
                AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL,
                {
                    data: {
                        userName: createdUser.userName,
                    },
                    toEmails: [email],
                } as ISendEmailBasePayload<IWelcomeEmailDataPaylaod>,
                { delay: 15000 }
            );

            return {
                ...tokens,
                user: createdUser,
            };
        } catch (error) {
            throw error;
        }
    }

    public async refreshTokens(
        payload: IAuthUser
    ): Promise<AuthRefreshResponseDto> {
        return this.helperEncryptionService.createJwtTokens({
            userId: payload.userId,
            role: payload.role,
        });
    }
}
