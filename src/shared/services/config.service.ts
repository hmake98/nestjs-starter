import { Injectable, Scope } from "@nestjs/common";
import { config } from "dotenv";
config();

const variables: { [key: string]: any } = {};
@Injectable({ scope: Scope.DEFAULT })
export class ConfigService {
  constructor() {
    variables.env = process.env.NODE_ENV;
    variables.authKey = process.env.AUTH_SECRET;
    variables.accesstokenExpr = process.env.ACCESS_EXP;
    variables.refreshtokenExpr = process.env.REFRESH_EXP;
    variables.limit = process.env.LIMIT;
    variables.aws = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      sourceEmail: process.env.SOURCE_EMAIL,
      awsBucket: process.env.AWS_BUCKET,
      linkExpires: process.env.EXPIRES,
    };
    variables.redis = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      queue: process.env.QUEUE_NAME,
    };
  }

  public get(key: keyof typeof variables): any {
    return variables[key];
  }
}
