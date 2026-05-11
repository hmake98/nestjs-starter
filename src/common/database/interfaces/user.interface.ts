import type { User } from '@prisma/client';

import type { UserRole } from '../enums/role.enum';

export type UserEntity = User;

export interface CreateUserInput {
    email: string;
    userName: string;
    password: string;
    role: UserRole;
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
