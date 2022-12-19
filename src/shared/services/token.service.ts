import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthResponse } from '../types';
import { appConfig } from '../../utils/common';
import { User } from '../../database/models';

@Injectable()
export class TokenService {
  private secretKey: string;
  private accessTokenExpr: string;

  constructor() {
    this.secretKey = appConfig.authKey;
    this.accessTokenExpr = appConfig.accesstokenExpr;
  }

  public async generateResponse(user: User): Promise<AuthResponse> {
    const tokens = new AuthResponse();
    delete user.dataValues.password;
    tokens.accessToken = await this.generateNewAccessToken({
      userId: user.id,
      role: user.role,
    });
    tokens.user = user;
    return tokens;
  }

  public async generateNewAccessToken(payload: {
    userId: number;
    role: string;
  }): Promise<string> {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.accessTokenExpr,
    });
  }

  public verify(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, this.secretKey);
  }
}
