import {
    randomBytes,
    scrypt,
    createCipheriv,
    createDecipheriv,
} from 'node:crypto';
import { promisify } from 'node:util';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import {
    IAuthTokenResponse,
    IEncryptDataPayload,
} from '../interfaces/encryption.interface';
import { IHelperEncryptionService } from '../interfaces/encryption.service.interface';

@Injectable()
export class HelperEncryptionService implements IHelperEncryptionService {
    private readonly logger = new Logger(HelperEncryptionService.name);
    private readonly algorithm = 'aes-256-gcm';
    private readonly keyLength = 32;
    private readonly saltLength = 16;
    private readonly ivLength = 12;
    private readonly tagLength = 16;

    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExpire: string;
    private readonly refreshTokenExpire: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
        this.accessTokenSecret = this.configService.getOrThrow<string>(
            'auth.accessToken.secret'
        );
        this.refreshTokenSecret = this.configService.getOrThrow<string>(
            'auth.refreshToken.secret'
        );
        this.accessTokenExpire = this.configService.getOrThrow<string>(
            'auth.accessToken.tokenExp'
        );
        this.refreshTokenExpire = this.configService.getOrThrow<string>(
            'auth.refreshToken.tokenExp'
        );
    }

    public async createJwtTokens(
        payload: IAuthUser
    ): Promise<IAuthTokenResponse> {
        const [accessToken, refreshToken] = await Promise.all([
            this.createAccessToken(payload),
            this.createRefreshToken(payload),
        ]);
        return { accessToken, refreshToken };
    }

    public createAccessToken(payload: IAuthUser): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.accessTokenSecret,
            expiresIn: this.accessTokenExpire,
        });
    }

    public createRefreshToken(payload: IAuthUser): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.refreshTokenSecret,
            expiresIn: this.refreshTokenExpire,
        });
    }

    public createHash(password: string): Promise<string> {
        return argon2.hash(password);
    }

    public match(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password);
    }

    public async encrypt(text: string): Promise<IEncryptDataPayload> {
        const salt = randomBytes(this.saltLength);
        const iv = randomBytes(this.ivLength);
        const key = await this.deriveKey(this.accessTokenSecret, salt);

        const cipher = createCipheriv(this.algorithm, key, iv, {
            authTagLength: this.tagLength,
        });
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);
        const tag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
            data: encrypted.toString('hex'),
            tag: tag.toString('hex'),
            salt: salt.toString('hex'),
        };
    }

    public async decrypt({
        data,
        iv,
        tag,
        salt,
    }: IEncryptDataPayload): Promise<string> {
        try {
            const key = await this.deriveKey(
                this.accessTokenSecret,
                Buffer.from(salt, 'hex')
            );
            const decipher = createDecipheriv(
                this.algorithm,
                key,
                Buffer.from(iv, 'hex'),
                {
                    authTagLength: this.tagLength,
                }
            );
            decipher.setAuthTag(Buffer.from(tag, 'hex'));

            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(data, 'hex')),
                decipher.final(),
            ]);

            return decrypted.toString('utf8');
        } catch (error) {
            throw error;
        }
    }

    private async deriveKey(secret: string, salt: Buffer): Promise<Buffer> {
        const scryptAsync = promisify(scrypt);
        return scryptAsync(secret, salt, this.keyLength) as Promise<Buffer>;
    }
}
