import type { Role, User } from '@prisma/client';

export interface CreateUserInput {
    email: string;
    userName: string;
    password: string;
    role: Role;
    firstName?: string | null;
    lastName?: string | null;
    isVerified?: boolean;
}

export interface UpdateUserInput {
    email?: string;
    userName?: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
}

/**
 * UserRepository is the data-access contract for the User aggregate.
 *
 * Used as both the TypeScript type **and** the DI token — bind to a concrete
 * implementation in the module via `{ provide: UserRepository, useClass: ... }`.
 *
 * To swap Prisma for another ORM/data store, write a new class implementing
 * this contract and update the binding. No service or controller code changes.
 */
export abstract class UserRepository {
    abstract findById(id: string): Promise<User | null>;

    abstract findByEmail(email: string): Promise<User | null>;

    abstract existsById(id: string): Promise<boolean>;

    abstract existsByEmail(email: string): Promise<boolean>;

    abstract create(data: CreateUserInput): Promise<User>;

    abstract update(id: string, data: UpdateUserInput): Promise<User>;

    /** Sets `deletedAt = now()`. Idempotent — does not validate prior state. */
    abstract softDelete(id: string): Promise<User>;

    /** Hard-deletes by email. Returns the number of rows removed. */
    abstract hardDeleteByEmail(email: string): Promise<number>;
}
