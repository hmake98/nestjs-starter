import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { UserLoginDto } from '../dtos/auth.login.dto';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
} from '../dtos/response/auth.response.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';

export interface IAuthService {
    login(data: UserLoginDto): Promise<AuthResponseDto>;
    signup(data: UserCreateDto): Promise<AuthResponseDto>;
    refreshTokens(payload: IAuthUser): Promise<AuthRefreshResponseDto>;
}
