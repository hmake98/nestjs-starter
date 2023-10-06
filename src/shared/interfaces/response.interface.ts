import { User } from '../../common/database/entities';

export interface ErrorResponse {
  status: boolean;
  message: string;
  error: any;
}

export interface GetResponse<T> {
  count: number;
  data: T[];
}

export interface SuccessResponse {
  status: boolean;
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
