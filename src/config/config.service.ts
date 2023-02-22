import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();
import { AppConfig } from '../types';

@Injectable()
export class ConfigService {
  private appConfig: AppConfig = {
    node_env: null,
    auth_secret: null,
    token_exp: null,
    aws_access_key: null,
    aws_secret_key: null,
    aws_region: null,
    aws_source_email: null,
    aws_bucket: null,
    aws_link_exp: null,
    redis_host: null,
    redis_port: null,
    database_host: null,
    database_name: null,
    database_password: null,
    database_port: null,
    database_user: null,
    port: null,
  };

  constructor() {
    this.appConfig.port = process.env.PORT;
    this.appConfig.node_env = process.env.NODE_ENV;
    this.appConfig.auth_secret = process.env.AUTH_SECRET;
    this.appConfig.token_exp = process.env.TOKEN_EXP;
    this.appConfig.aws_access_key = process.env.AWS_ACCESS_KEY;
    this.appConfig.aws_secret_key = process.env.AWS_SECRET_KEY;
    this.appConfig.aws_region = process.env.AWS_REGION;
    this.appConfig.aws_source_email = process.env.SOURCE_EMAIL;
    this.appConfig.aws_bucket = process.env.AWS_BUCKET;
    this.appConfig.aws_link_exp = process.env.AWS_LINK_EXPIRES;
    this.appConfig.redis_host = process.env.REDIS_HOST;
    this.appConfig.redis_port = process.env.REDIS_PORT;
    this.appConfig.database_host = process.env.DATABASE_HOST;
    this.appConfig.database_user = process.env.DATABASE_USER;
    this.appConfig.database_password = process.env.DATABASE_PASSWORD;
    this.appConfig.database_port = process.env.DATABASE_PORT;
    this.appConfig.database_name = process.env.DATABASE_NAME;
  }

  get(key: keyof AppConfig) {
    return this.appConfig[key];
  }
}
