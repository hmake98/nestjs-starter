import { User } from 'src/database/models';

export interface GetResponse<T> {
  count: number;
  data: T[];
}

export interface SuccessResponse {
  status: boolean;
  message: string;
}

export class AuthResponse {
  accessToken: string;
  user: User;
}

export interface IPreSignedUrlParams {
  Bucket?: string;
  Key: string;
  Expires?: number;
  ContentType?: string;
}

export interface IPreSignedUrlBody {
  name: string;
  userId: number;
  type: keyof typeof IStorage;
}

export interface AuthPayload {
  id: number;
  email: string;
  type: string;
  role: string;
  iat: number;
  exp: number;
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}

enum IStorage {
  PROFILES,
  POSTS,
}
