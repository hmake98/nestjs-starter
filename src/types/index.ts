import { User } from '../database/entities';

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

export interface IPreSignedUrlParams {
  Bucket: string;
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
  email?: string;
  role: string;
  sub: number;
}

export enum IStorage {
  PROFILES,
  POSTS,
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export enum TokenStatus {
  ACTIVE = 'active',
  ARCHIVE = 'archive',
}
