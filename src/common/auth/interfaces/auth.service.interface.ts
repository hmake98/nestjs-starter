import { AuthResponse } from 'src/core/interfaces/response.interface';
import { UserLoginDto } from '../dtos/auth.login.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';

export interface IAuthService {
  login(data: UserLoginDto): Promise<AuthResponse>;
  signup(data: UserCreateDto): Promise<AuthResponse>;
}
