import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    env: process.env.APP_ENV ?? 'development',
    name: process.env.APP_NAME ?? 'nestjs-starter',
    versioning: {
      enable: process.env.HTTP_VERSIONING_ENABLE === 'true' ?? false,
      prefix: 'v',
      version: process.env.HTTP_VERSION ?? '1',
    },
    throttle: {
      ttl: 60,
      limit: 10,
    },
    http: {
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT ? Number.parseInt(process.env.HTTP_PORT) : 3000,
    },
    globalPrefix: '/api',
    debug: process.env.APP_DEBUG,
  }),
);
