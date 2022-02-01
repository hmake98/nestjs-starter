import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from 'src/config/config.service';
import { AuthToken } from '../interfaces';
import { Auth } from '../interfaces/Auth';
import { GenerateToken } from '../interfaces/generate-token';

@Injectable()
export class TokenService {
  private secretKey: string;
  private accessTokenExpr: string;
  private refreshTokenExpr: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get('authKey');
    this.accessTokenExpr = this.configService.get('accesstokenExpr');
    this.refreshTokenExpr = this.configService.get('refreshtokenExpr');
  }

  public async generateNewTokens(user: GenerateToken): Promise<AuthToken> {
    const tokens = new AuthToken();
    tokens.accessToken = await this.generateNewAccessToken(user);
    tokens.refreshToken = await this.generateNewRefeshToken(user);
    tokens.user = user;
    return tokens;
  }

  public async generateNewRefeshToken(user: GenerateToken): Promise<string> {
    const token = new AuthToken();
    token.user = user;
    const refreshToken = await this.generateTokenId(token, 'refreshToken');
    return refreshToken;
  }

  public async generateNewAccessToken(user: GenerateToken): Promise<string> {
    const token = new AuthToken();
    token.user = user;
    const accessToken = await this.generateTokenId(token, 'accessToken');
    return accessToken;
  }

  private async generateTokenId(token: AuthToken, type: string): Promise<string> {
    const expiresIn = type === 'accessToken' ? this.accessTokenExpr : this.refreshTokenExpr;
    return jwt.sign(
      {
        ...token.user,
        type,
      },
      this.secretKey,
      {
        expiresIn,
      },
    );
  }

  public async verify(token: string): Promise<Auth> {
    let tokenClaim;
    try {
      tokenClaim = jwt.verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
    return { ...tokenClaim };
  }
}
