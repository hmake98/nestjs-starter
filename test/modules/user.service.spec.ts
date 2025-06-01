import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from 'src/common/database/services/database.service';
import { UserUpdateDto } from 'src/modules/user/dtos/request/user.update.request';
import { UserService } from 'src/modules/user/services/user.service';

describe('UserService', () => {
    let service: UserService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: DatabaseService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('updateUser', () => {
        it('should throw an error if user is not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(
                service.updateUser('non-existent-id', { firstName: 'John' })
            ).rejects.toThrow(HttpException);
        });

        it('should update and return the user if user exists', async () => {
            const mockUser = { id: '123', firstName: 'John', lastName: 'Doe' };
            const updateDto: UserUpdateDto = { firstName: 'Jane' };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.update.mockResolvedValue({
                ...mockUser,
                ...updateDto,
            });

            const result = await service.updateUser('123', updateDto);

            expect(result).toEqual({ ...mockUser, ...updateDto });
        });
    });

    describe('deleteUser', () => {
        it('should throw an error if user is not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.deleteUser('non-existent-id')).rejects.toThrow(
                HttpException
            );
        });

        it('should soft delete the user and return success message', async () => {
            const mockUser = { id: '123', firstName: 'John', lastName: 'Doe' };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.update.mockResolvedValue({
                ...mockUser,
                deletedAt: new Date(),
            });

            const result = await service.deleteUser('123');

            expect(result).toEqual({
                success: true,
                message: 'user.success.userDeleted',
            });
        });
    });

    describe('getProfile', () => {
        it('should throw an error if user is not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.getProfile('non-existent-id')).rejects.toThrow(
                HttpException
            );
        });

        it('should return the user profile if user exists', async () => {
            const mockUser = { id: '123', firstName: 'John', lastName: 'Doe' };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getProfile('123');

            expect(result).toEqual(mockUser);
        });
    });
});
