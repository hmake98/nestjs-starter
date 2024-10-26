import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import {
    IAuthTokenResponse,
    IEncryptDataPayload,
} from './encryption.interface';

export interface IHelperEncryptionService {
    createJwtTokens(payload: IAuthUser): Promise<IAuthTokenResponse>;
    createAccessToken(payload: IAuthUser): Promise<string>;
    createRefreshToken(payload: IAuthUser): Promise<string>;
    createHash(password: string): Promise<string>;
    match(hash: string, password: string): Promise<boolean>;
    encrypt(text: string): Promise<IEncryptDataPayload>;
    decrypt(data: IEncryptDataPayload): Promise<string>;
}
