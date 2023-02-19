import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '../../config/config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from '../../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth_secret'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, role: payload.role };
  }

  generateToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload);
  }
}
