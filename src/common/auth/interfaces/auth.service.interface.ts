import { AuthResponse } from 'src/shared/interfaces/response.interface';
import { UserLoginDto } from '../dtos/login.dto';
import { UserCreateDto } from '../dtos/signup.dto';

export interface IAuthService {
  login(data: UserLoginDto): Promise<AuthResponse>;
  signup(data: UserCreateDto): Promise<AuthResponse>;
}
