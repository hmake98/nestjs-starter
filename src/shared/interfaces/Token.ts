import { User } from 'src/database/entities/user.entity';

export class AuthToken {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
  user: User;
}
