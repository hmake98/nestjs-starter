import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class FacebookService extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    // this.facebook = this.configService.get('facebook');
    super({
      clientID: configService.get('facebook').appId,
      clientSecret: configService.get('facebook').appSecret,
      callbackURL: 'http://localhost:3000/api/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
      enableProof: true,
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { emails, name } = profile;
    const user: {
      email: any;
      firstName: string;
      lastName: string;
    } = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    const payload: {
      user: {
        email: string;
        firstName: string;
        lastName: string;
      };
      accessToken: string;
    } = {
      accessToken,
      user,
    };
    done(null, payload);
  }
}
