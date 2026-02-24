import { registerAs } from '@nestjs/config';

export default registerAs('redis', (): Record<string, any> => {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    return {
        url: redisUrl,
        tls: redisUrl.startsWith('rediss://') ? {} : null,
    };
});
