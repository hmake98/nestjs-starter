import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    secret: process.env.AUTH_SECRET,
    tokenExp: process.env.TOKEN_EXP,
  }),
);
