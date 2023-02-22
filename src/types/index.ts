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

export interface ErrorResponse {
  status: boolean;
  message: string;
  error: any;
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
  userId: number;
  role: string;
}

export enum IStorage {
  PROFILES = 'profiles',
  POSTS = 'posts',
}

export enum UserRoles {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export enum TokenStatus {
  ACTIVE = 'active',
  ARCHIVE = 'archive',
}

export type AppConfig = {
  node_env: string;
  port: string;
  auth_secret: string;
  token_exp: string;
  database_name: string;
  database_user: string;
  database_password: string;
  database_port: string;
  database_host: string;
  aws_access_key: string;
  aws_secret_key: string;
  aws_region: string;
  aws_bucket: string;
  aws_link_exp: string;
  aws_source_email: string;
  redis_host: string;
  redis_port: string;
};
