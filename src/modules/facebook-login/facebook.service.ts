import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from 'src/config/config.service';
import { Role } from 'src/database/entities';
import { UserRepository } from 'src/shared/repository';
import { UserCreateDto } from '../user/dto';

@Injectable()
export class FacebookService extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService, private readonly userRepository: UserRepository) {
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
    try {
      const { emails, name } = profile;
      const checkUser = await this.userRepository.findUserAccountByEmail(emails[0].value);
      if (checkUser) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const newUser = {} as UserCreateDto;
      newUser.email = emails[0].value;
      newUser.firstName = name.givenName;
      newUser.lastName = name.familyName;
      newUser.role = Role.USER;
      const user = await this.userRepository.createUser(newUser);
      done(null, { ...user, accessToken });
    } catch (e) {
      done(new InternalServerErrorException(e), null);
    }
  }
}
