import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '../constants/cache.constant';

@Injectable()
export class CacheService implements OnModuleDestroy {
    private readonly logger = new Logger(CacheService.name);

    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

    async onModuleDestroy(): Promise<void> {
        await this.redis.quit();
    }

    /**
     * Retrieve a value by key. Returns null when the key does not exist.
     * JSON-serialised values are automatically deserialised.
     */
    async get<T = string>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);
        if (value === null) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    /**
     * Store a value. Objects/arrays are JSON-serialised automatically.
     * @param ttlSeconds Optional TTL in seconds. Omit to persist indefinitely.
     */
    async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
        const serialised =
            typeof value === 'string' ? value : JSON.stringify(value);
        if (ttlSeconds !== undefined && ttlSeconds > 0) {
            await this.redis.set(key, serialised, 'EX', ttlSeconds);
        } else {
            await this.redis.set(key, serialised);
        }
    }

    /**
     * Delete one or more keys.
     */
    async del(...keys: string[]): Promise<void> {
        if (keys.length === 0) return;
        await this.redis.del(...keys);
    }

    /**
     * Check whether a key exists.
     */
    async exists(key: string): Promise<boolean> {
        const count = await this.redis.exists(key);
        return count > 0;
    }

    /**
     * Return all keys matching a glob-style pattern (e.g. "user:*").
     * Avoid in production on large datasets – use SCAN-based helpers instead.
     */
    async keys(pattern: string): Promise<string[]> {
        return this.redis.keys(pattern);
    }

    /**
     * Set a hash field value.
     */
    async hset(key: string, field: string, value: unknown): Promise<void> {
        const serialised =
            typeof value === 'string' ? value : JSON.stringify(value);
        await this.redis.hset(key, field, serialised);
    }

    /**
     * Get a single hash field value. Returns null when the field does not exist.
     */
    async hget<T = string>(key: string, field: string): Promise<T | null> {
        const value = await this.redis.hget(key, field);
        if (value === null) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    /**
     * Get all fields and values of a hash. Returns null when the key does not exist.
     */
    async hgetall<T = Record<string, string>>(key: string): Promise<T | null> {
        const value = await this.redis.hgetall(key);
        if (!value || Object.keys(value).length === 0) return null;
        return value as unknown as T;
    }

    /**
     * Delete one or more hash fields.
     */
    async hdel(key: string, ...fields: string[]): Promise<void> {
        if (fields.length === 0) return;
        await this.redis.hdel(key, ...fields);
    }

    /**
     * Atomically increment a counter. Creates the key at 0 before incrementing.
     */
    async incr(key: string): Promise<number> {
        return this.redis.incr(key);
    }

    /**
     * Atomically decrement a counter.
     */
    async decr(key: string): Promise<number> {
        return this.redis.decr(key);
    }

    /**
     * Update the TTL on an existing key.
     */
    async expire(key: string, ttlSeconds: number): Promise<void> {
        await this.redis.expire(key, ttlSeconds);
    }

    /**
     * Return the remaining TTL in seconds. -1 = no expiry, -2 = key not found.
     */
    async ttl(key: string): Promise<number> {
        return this.redis.ttl(key);
    }

    /**
     * Delete all keys in the current database. Use with caution.
     */
    async flush(): Promise<void> {
        await this.redis.flushdb();
    }

    /**
     * Returns true when the Redis connection is ready.
     */
    isHealthy(): boolean {
        return this.redis.status === 'ready';
    }

    /**
     * Expose the raw IORedis client for advanced operations.
     */
    getClient(): Redis {
        return this.redis;
    }
}
