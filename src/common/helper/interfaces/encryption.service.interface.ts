import { IAuthUser } from 'src/core/interfaces/request.interface';

import { IAuthTokenResponse } from './encryption.interface';

export interface IEncryptionService {
  createJwtTokens(payload: IAuthUser): Promise<IAuthTokenResponse>;
  createAccessToken(payload: IAuthUser): Promise<string>;
  createRefreshToken(payload: IAuthUser): Promise<string>;
  createHash(password: string): Promise<string>;
  match(hash: string, password: string): Promise<boolean>;
  encrypt(text: string): { iv: string; data: string };
  decrypt(data: { iv: string; data: string }): string;
}
