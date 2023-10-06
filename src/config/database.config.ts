import { registerAs } from '@nestjs/config';

export default registerAs(
  'db',
  (): Record<string, any> => ({
    name: process.env.DATABASE_NAME ?? 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
  }),
);
