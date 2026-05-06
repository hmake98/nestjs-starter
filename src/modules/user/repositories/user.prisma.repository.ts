import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';

import { DatabaseService } from 'src/common/database/services/database.service';

import {
    CreateUserInput,
    UpdateUserInput,
    UserRepository,
} from './user.repository';

@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    findById(id: string): Promise<User | null> {
        return this.databaseService.user.findUnique({ where: { id } });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.databaseService.user.findUnique({ where: { email } });
    }

    async existsById(id: string): Promise<boolean> {
        const found = await this.databaseService.user.findUnique({
            where: { id },
            select: { id: true },
        });
        return found !== null;
    }

    async existsByEmail(email: string): Promise<boolean> {
        const found = await this.databaseService.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return found !== null;
    }

    create(data: CreateUserInput): Promise<User> {
        return this.databaseService.user.create({ data });
    }

    update(id: string, data: UpdateUserInput): Promise<User> {
        return this.databaseService.user.update({ where: { id }, data });
    }

    softDelete(id: string): Promise<User> {
        return this.databaseService.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async hardDeleteByEmail(email: string): Promise<number> {
        const result = await this.databaseService.user.deleteMany({
            where: { email },
        });
        return result.count;
    }
}
