import { registerAs } from '@nestjs/config';

export default registerAs(
    'redis',
    (): Record<string, any> => ({
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_ENABLE_TLS === 'true' ? {} : null,
    })
);
