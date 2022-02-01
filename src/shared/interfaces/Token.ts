import { GenerateToken } from './generate-token';

export class AuthToken {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
  user: GenerateToken;
}
