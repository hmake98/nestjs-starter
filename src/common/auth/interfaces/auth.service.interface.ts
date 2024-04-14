import { UserLoginDto } from '../dtos/auth.login.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { IAuthResponse } from './auth.interface';

export interface IAuthService {
  login(data: UserLoginDto): Promise<IAuthResponse>;
  signup(data: UserCreateDto): Promise<IAuthResponse>;
}
