import { User } from 'src/database/entities/user.entity';

export class Token {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
  user: User;
}
