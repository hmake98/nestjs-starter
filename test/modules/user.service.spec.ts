import { HttpException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import {
    CACHE_SERVICE,
    CachePlugin,
    type ICacheService,
} from '@nestjs-redisx/cache';
import { RedisTestingModule } from '@nestjs-redisx/testing';

import { UserRepository } from 'src/common/database/repositories/user.repository';
import { type UserUpdateDto } from 'src/modules/user/dtos/user.update.dto';
import { UserService } from 'src/modules/user/services/user.service';

describe('UserService', () => {
    let service: UserService;
    let cacheService: ICacheService;

    const mockUserRepository = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        existsById: jest.fn(),
        existsByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        hardDeleteByEmail: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                RedisTestingModule.forRoot({ plugins: [new CachePlugin()] }),
            ],
            providers: [
                UserService,
                { provide: UserRepository, useValue: mockUserRepository },
            ],
        }).compile();

        await module.init();

        service = module.get<UserService>(UserService);
        cacheService = module.get<ICacheService>(CACHE_SERVICE);
        await cacheService.clear();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        it('throws when user is not found', async () => {
            mockUserRepository.findById.mockResolvedValue(null);
            await expect(service.getProfile('missing')).rejects.toThrow(
                HttpException
            );
        });

        it('returns the user when found', async () => {
            const user = { id: '1', firstName: 'John' };
            mockUserRepository.findById.mockResolvedValue(user);

            await expect(service.getProfile('1')).resolves.toEqual(user);
        });

        it('serves the second lookup from cache', async () => {
            const user = { id: '1', firstName: 'John' };
            mockUserRepository.findById.mockResolvedValue(user);

            await service.getProfile('1');
            await expect(service.getProfile('1')).resolves.toEqual(user);
            expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateUser', () => {
        it('throws when user does not exist', async () => {
            mockUserRepository.existsById.mockResolvedValue(false);

            await expect(
                service.updateUser('missing', { firstName: 'Jane' })
            ).rejects.toThrow(HttpException);
        });

        it('updates and returns the user', async () => {
            const dto: UserUpdateDto = { firstName: 'Jane' };
            const updated = { id: '1', firstName: 'Jane' };
            mockUserRepository.existsById.mockResolvedValue(true);
            mockUserRepository.update.mockResolvedValue(updated);

            await expect(service.updateUser('1', dto)).resolves.toEqual(
                updated
            );
            expect(mockUserRepository.update).toHaveBeenCalledWith('1', dto);
        });

        it('invalidates the cached profile', async () => {
            const user = { id: '1', firstName: 'John' };
            mockUserRepository.findById.mockResolvedValue(user);
            mockUserRepository.existsById.mockResolvedValue(true);
            mockUserRepository.update.mockResolvedValue({
                id: '1',
                firstName: 'Jane',
            });

            await service.getProfile('1');
            await service.updateUser('1', { firstName: 'Jane' });
            await service.getProfile('1');

            expect(mockUserRepository.findById).toHaveBeenCalledTimes(2);
        });
    });

    describe('deleteUser', () => {
        it('throws when user does not exist', async () => {
            mockUserRepository.existsById.mockResolvedValue(false);
            await expect(service.deleteUser('missing')).rejects.toThrow(
                HttpException
            );
        });

        it('soft-deletes and returns success message', async () => {
            mockUserRepository.existsById.mockResolvedValue(true);
            mockUserRepository.softDelete.mockResolvedValue({
                id: '1',
                deletedAt: new Date(),
            });

            await expect(service.deleteUser('1')).resolves.toEqual({
                success: true,
                message: 'user.success.userDeleted',
            });
            expect(mockUserRepository.softDelete).toHaveBeenCalledWith('1');
        });
    });
});
