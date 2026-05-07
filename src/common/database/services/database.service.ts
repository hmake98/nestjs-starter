import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma: PrismaClient;
    private readonly pool: Pool;
    readonly user: PrismaClient['user'];

    constructor(configService: ConfigService) {
        this.pool = new Pool({
            connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        });
        this.prisma = new PrismaClient({ adapter: new PrismaPg(this.pool) });
        this.user = this.prisma.user;
    }

    async onModuleInit() {
        await this.prisma.$connect();
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
        await this.pool.end();
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return { prisma: { status: 'up' } };
        } catch {
            return { prisma: { status: 'down' } };
        }
    }
}
