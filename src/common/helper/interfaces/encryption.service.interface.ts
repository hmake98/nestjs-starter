import {
  IAuthTokenResponse,
  IAuthUser,
} from 'src/common/auth/interfaces/auth.interface';

export interface IEncryptionService {
  createJwtTokens(payload: IAuthUser): Promise<IAuthTokenResponse>;
  createAccessToken(payload: IAuthUser): Promise<string>;
  createRefreshToken(payload: IAuthUser): Promise<string>;
  createHash(password: string): string;
  match(hash: string, password: string): boolean;
  encrypt(text: string): { iv: string; data: string };
  decrypt(data: { iv: string; data: string }): string;
}
