import { config } from 'dotenv';
config({ path: `${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '.development'}.env` });
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.env = process.env.NODE_ENV;
    this.config.authKey = process.env.AUTH_SECRET;
    this.config.accesstokenExpr = process.env.ACCESS_EXP;
    this.config.refreshtokenExpr = process.env.REFRESH_EXP;
    this.config.sourceEmail = process.env.SOURCE_EMAIL;
    this.config.awsBucket = process.env.AWS_BUCKET;
    this.config.linkExpires = process.env.EXPIRES;
    this.config.limit = process.env.LIMIT;
    this.config.skip = process.env.SKIP;
    this.config.database = {
      DB_TYPE: 'postgres',
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
    };
    this.config.aws = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    };
    this.config.bull = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      queueName: process.env.QUEUE_NAME,
    };
  }

  public get(key: string): any {
    return this.config[key];
  }
}
