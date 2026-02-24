import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';

import { REDIS_CLIENT } from 'src/common/cache/constants/cache.constant';
import { CacheService } from 'src/common/cache/services/cache.service';

const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    keys: jest.fn(),
    hset: jest.fn(),
    hget: jest.fn(),
    hgetall: jest.fn(),
    hdel: jest.fn(),
    incr: jest.fn(),
    decr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    flushdb: jest.fn(),
    quit: jest.fn(),
    status: 'ready',
};

describe('CacheService', () => {
    let service: CacheService;
    let redis: typeof mockRedis;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CacheService,
                {
                    provide: REDIS_CLIENT,
                    useValue: mockRedis,
                },
            ],
        }).compile();

        service = module.get<CacheService>(CacheService);
        redis = module.get<typeof mockRedis>(REDIS_CLIENT);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleDestroy', () => {
        it('should call redis.quit on destroy', async () => {
            redis.quit.mockResolvedValue('OK');
            await service.onModuleDestroy();
            expect(redis.quit).toHaveBeenCalledTimes(1);
        });
    });

    describe('get', () => {
        it('should return null when key does not exist', async () => {
            redis.get.mockResolvedValue(null);
            const result = await service.get('missing');
            expect(result).toBeNull();
            expect(redis.get).toHaveBeenCalledWith('missing');
        });

        it('should deserialise a JSON value', async () => {
            redis.get.mockResolvedValue(JSON.stringify({ id: 1 }));
            const result = await service.get<{ id: number }>('key');
            expect(result).toEqual({ id: 1 });
        });

        it('should return a plain string when value is not JSON', async () => {
            redis.get.mockResolvedValue('hello');
            const result = await service.get('key');
            expect(result).toBe('hello');
        });
    });

    describe('set', () => {
        it('should set a value without TTL', async () => {
            redis.set.mockResolvedValue('OK');
            await service.set('key', 'value');
            expect(redis.set).toHaveBeenCalledWith('key', 'value');
        });

        it('should set a value with TTL', async () => {
            redis.set.mockResolvedValue('OK');
            await service.set('key', 'value', 60);
            expect(redis.set).toHaveBeenCalledWith('key', 'value', 'EX', 60);
        });

        it('should JSON-serialise objects', async () => {
            redis.set.mockResolvedValue('OK');
            await service.set('key', { foo: 'bar' });
            expect(redis.set).toHaveBeenCalledWith(
                'key',
                JSON.stringify({ foo: 'bar' })
            );
        });

        it('should not apply TTL when ttlSeconds is 0', async () => {
            redis.set.mockResolvedValue('OK');
            await service.set('key', 'value', 0);
            expect(redis.set).toHaveBeenCalledWith('key', 'value');
        });
    });

    describe('del', () => {
        it('should delete one key', async () => {
            redis.del.mockResolvedValue(1);
            await service.del('key1');
            expect(redis.del).toHaveBeenCalledWith('key1');
        });

        it('should delete multiple keys', async () => {
            redis.del.mockResolvedValue(2);
            await service.del('key1', 'key2');
            expect(redis.del).toHaveBeenCalledWith('key1', 'key2');
        });

        it('should be a no-op when called with no keys', async () => {
            await service.del();
            expect(redis.del).not.toHaveBeenCalled();
        });
    });

    describe('exists', () => {
        it('should return true when key exists', async () => {
            redis.exists.mockResolvedValue(1);
            const result = await service.exists('key');
            expect(result).toBe(true);
        });

        it('should return false when key does not exist', async () => {
            redis.exists.mockResolvedValue(0);
            const result = await service.exists('key');
            expect(result).toBe(false);
        });
    });

    describe('keys', () => {
        it('should return matching keys', async () => {
            redis.keys.mockResolvedValue(['user:1', 'user:2']);
            const result = await service.keys('user:*');
            expect(result).toEqual(['user:1', 'user:2']);
            expect(redis.keys).toHaveBeenCalledWith('user:*');
        });

        it('should return empty array when no keys match', async () => {
            redis.keys.mockResolvedValue([]);
            const result = await service.keys('nonexistent:*');
            expect(result).toEqual([]);
        });
    });

    describe('hset', () => {
        it('should set a hash field with a string value', async () => {
            redis.hset.mockResolvedValue(1);
            await service.hset('hash', 'field', 'value');
            expect(redis.hset).toHaveBeenCalledWith('hash', 'field', 'value');
        });

        it('should JSON-serialise object values', async () => {
            redis.hset.mockResolvedValue(1);
            await service.hset('hash', 'field', { a: 1 });
            expect(redis.hset).toHaveBeenCalledWith(
                'hash',
                'field',
                JSON.stringify({ a: 1 })
            );
        });
    });

    describe('hget', () => {
        it('should return null when field does not exist', async () => {
            redis.hget.mockResolvedValue(null);
            const result = await service.hget('hash', 'missing');
            expect(result).toBeNull();
        });

        it('should deserialise a JSON field value', async () => {
            redis.hget.mockResolvedValue(JSON.stringify({ x: 2 }));
            const result = await service.hget<{ x: number }>('hash', 'field');
            expect(result).toEqual({ x: 2 });
        });

        it('should return plain string when value is not JSON', async () => {
            redis.hget.mockResolvedValue('plain');
            const result = await service.hget('hash', 'field');
            expect(result).toBe('plain');
        });
    });

    describe('hgetall', () => {
        it('should return null when hash does not exist', async () => {
            redis.hgetall.mockResolvedValue({});
            const result = await service.hgetall('missing');
            expect(result).toBeNull();
        });

        it('should return all hash fields', async () => {
            const hash = { a: 'one', b: 'two' };
            redis.hgetall.mockResolvedValue(hash);
            const result = await service.hgetall('hash');
            expect(result).toEqual(hash);
        });
    });

    describe('hdel', () => {
        it('should delete hash fields', async () => {
            redis.hdel.mockResolvedValue(1);
            await service.hdel('hash', 'field1');
            expect(redis.hdel).toHaveBeenCalledWith('hash', 'field1');
        });

        it('should be a no-op when no fields provided', async () => {
            await service.hdel('hash');
            expect(redis.hdel).not.toHaveBeenCalled();
        });
    });

    describe('incr', () => {
        it('should increment and return new value', async () => {
            redis.incr.mockResolvedValue(5);
            const result = await service.incr('counter');
            expect(result).toBe(5);
            expect(redis.incr).toHaveBeenCalledWith('counter');
        });
    });

    describe('decr', () => {
        it('should decrement and return new value', async () => {
            redis.decr.mockResolvedValue(3);
            const result = await service.decr('counter');
            expect(result).toBe(3);
            expect(redis.decr).toHaveBeenCalledWith('counter');
        });
    });

    describe('expire', () => {
        it('should set expiry on a key', async () => {
            redis.expire.mockResolvedValue(1);
            await service.expire('key', 120);
            expect(redis.expire).toHaveBeenCalledWith('key', 120);
        });
    });

    describe('ttl', () => {
        it('should return remaining TTL', async () => {
            redis.ttl.mockResolvedValue(59);
            const result = await service.ttl('key');
            expect(result).toBe(59);
            expect(redis.ttl).toHaveBeenCalledWith('key');
        });

        it('should return -1 for persistent keys', async () => {
            redis.ttl.mockResolvedValue(-1);
            const result = await service.ttl('key');
            expect(result).toBe(-1);
        });

        it('should return -2 for non-existent keys', async () => {
            redis.ttl.mockResolvedValue(-2);
            const result = await service.ttl('missing');
            expect(result).toBe(-2);
        });
    });

    describe('flush', () => {
        it('should flush the current database', async () => {
            redis.flushdb.mockResolvedValue('OK');
            await service.flush();
            expect(redis.flushdb).toHaveBeenCalledTimes(1);
        });
    });

    describe('isHealthy', () => {
        it('should return true when status is ready', () => {
            Object.defineProperty(redis, 'status', {
                value: 'ready',
                configurable: true,
            });
            expect(service.isHealthy()).toBe(true);
        });

        it('should return false when status is not ready', () => {
            Object.defineProperty(redis, 'status', {
                value: 'end',
                configurable: true,
            });
            expect(service.isHealthy()).toBe(false);
        });
    });

    describe('getClient', () => {
        it('should return the underlying Redis client', () => {
            const client = service.getClient();
            expect(client).toBe(redis);
        });
    });
});
