export const appConfig = {
  env: process.env.NODE_ENV,
  authKey: process.env.AUTH_SECRET,
  accesstokenExpr: process.env.ACCESS_EXP,
  refreshtokenExpr: process.env.REFRESH_EXP,
  limit: process.env.LIMIT,
};

export const TEMPLATES = {
  FORGOT_PASSWORD: 'forgot-password',
  WELCOME: 'welcome',
};

export const statusMessages = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'NonAuthoritativeInfo',
  204: 'NoContent',
  205: 'ResetContent',
  206: 'PartialContent',
};

export const isDev = process.env.NODE_ENV === 'development' ? true : false;

export const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  sourceEmail: process.env.SOURCE_EMAIL,
  awsBucket: process.env.AWS_BUCKET,
  linkExpires: process.env.EXPIRES,
};

export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  notificationQueue: process.env.NOTIFICATION_QUEUE,
  emailQueue: process.env.EMAIL_QUEUE,
};
