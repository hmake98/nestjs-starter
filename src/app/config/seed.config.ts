import { registerAs } from '@nestjs/config';

export default registerAs('seed', () => ({
    admin: {
        email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com',
        password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin@1234',
        userName: process.env.SEED_ADMIN_USERNAME ?? 'admin',
    },
}));
