import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from 'types';
import { appConfig } from '../../utils/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.authKey,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }

  generateToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload);
  }
}
