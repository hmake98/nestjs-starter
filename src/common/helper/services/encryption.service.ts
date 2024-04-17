import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { IEncryptionService } from '../interfaces/encryption.service.interface';
import { IEncryptDataPayload } from '../interfaces/encryption.interface';
import {
  IAuthTokenResponse,
  IAuthUser,
} from 'src/common/auth/interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EncryptionService implements IEncryptionService {
  private iv: Buffer;
  private key: Buffer;

  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpire: string;
  private refreshTokenExpire: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.iv = randomBytes(16);
    this.key = randomBytes(32);

    this.accessTokenSecret = this.configService.get<string>(
      'auth.accessToken.secret',
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'auth.refreshToken.secret',
    );
    this.accessTokenExpire = this.configService.get<string>(
      'auth.accessToken.tokenExp',
    );
    this.refreshTokenExpire = this.configService.get<string>(
      'auth.refreshToken.tokenExp',
    );
  }

  public async createJwtTokens(
    payload: IAuthUser,
  ): Promise<IAuthTokenResponse> {
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
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

  public createHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public match(hash: string, password: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  public encrypt(text: string): IEncryptDataPayload {
    const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      data: encrypted.toString('hex'),
    };
  }

  public decrypt({ data, iv }: IEncryptDataPayload): string {
    const _iv = Buffer.from(iv, 'hex');
    const encryptedText = Buffer.from(data, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', this.key, _iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
