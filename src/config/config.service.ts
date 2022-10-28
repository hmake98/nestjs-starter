import { Injectable, Scope } from '@nestjs/common';
import { config } from 'dotenv';
config({ path: `.env${process.env.NODE_ENV !== 'development' ? '.' + process.env.NODE_ENV : ''}` });

@Injectable({ scope: Scope.DEFAULT })
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.env = process.env.NODE_ENV;
    this.config.authKey = process.env.AUTH_SECRET;
    this.config.accesstokenExpr = process.env.ACCESS_EXP;
    this.config.refreshtokenExpr = process.env.REFRESH_EXP;
    this.config.limit = process.env.LIMIT;
    this.config.aws = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      sourceEmail: process.env.SOURCE_EMAIL,
      awsBucket: process.env.AWS_BUCKET,
      linkExpires: process.env.EXPIRES,
    };
    this.config.redis = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      queue: process.env.QUEUE_NAME,
    };
  }

  public get(key: string): any {
    return this.config[key];
  }
}
