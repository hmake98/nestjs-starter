import { IAuthUser } from 'src/core/interfaces/request.interface';

import { UserLoginDto } from '../dtos/auth.login.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import {
  AuthRefreshResponseDto,
  AuthResponseDto,
} from '../dtos/auth.response.dto';

export interface IAuthService {
  login(data: UserLoginDto): Promise<AuthResponseDto>;
  signup(data: UserCreateDto): Promise<AuthResponseDto>;
  refreshTokens(payload: IAuthUser): Promise<AuthRefreshResponseDto>;
}
