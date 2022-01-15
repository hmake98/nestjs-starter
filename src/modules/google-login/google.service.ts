import { UserRepository } from 'src/shared/repository';
import { ConfigService } from 'src/config/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { UserCreateDto } from '../user/dto';
import { Role } from 'src/database/entities';

@Injectable()
export class GoogleService extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService, private readonly userRepository: UserRepository) {
    super({
      clientID: configService.get('google').clientID,
      clientSecret: configService.get('google').clientSecret,
      callbackURL: 'http://localhost:3000/api/google/redirect',
      scope: ['profile', 'email'],
    });
  }
  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<object> {
    try {
      console.log(profile);

      const userCheck = await this.userRepository.findUserAccountByEmail(profile.emails[0].value);
      if (userCheck) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const newUser = {} as UserCreateDto;
      newUser.email = profile.emails[0].value;
      newUser.firstName = profile.name.givenName;
      newUser.lastName = profile.name.familyName;
      newUser.role = Role.USER;
      const user = await this.userRepository.createUser(newUser);
      return { ...user, accessToken, refreshToken };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
