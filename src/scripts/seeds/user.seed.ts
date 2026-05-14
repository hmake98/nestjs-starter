import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Command } from 'nestjs-command';

import { UserRole } from 'src/common/database/enums/role.enum';
import { UserRepository } from 'src/common/database/repositories/user.repository';

@Injectable()
export class UserSeed {
    private readonly logger = new Logger(UserSeed.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService
    ) {}

    @Command({
        command: 'seed:admin',
        describe: 'Create the default admin user (idempotent).',
    })
    async seedAdmin(): Promise<void> {
        const { email, password, userName } = this.adminConfig();

        if (await this.userRepository.existsByEmail(email)) {
            this.logger.log(`Admin user already exists: ${email}`);
            return;
        }

        const hashed = await argon2.hash(password);
        const user = await this.userRepository.create({
            email,
            userName,
            password: hashed,
            role: UserRole.ADMIN,
            firstName: 'Admin',
            isVerified: true,
        });
        this.logger.log(`Created admin user ${user.email} (id=${user.id})`);
    }

    @Command({
        command: 'remove:admin',
        describe: 'Hard-delete the default admin user (idempotent).',
    })
    async removeAdmin(): Promise<void> {
        const { email } = this.adminConfig();

        const removed = await this.userRepository.hardDeleteByEmail(email);
        if (removed === 0) {
            this.logger.log(`Admin user not found: ${email}`);
            return;
        }
        this.logger.log(`Removed admin user: ${email}`);
    }

    private adminConfig(): {
        email: string;
        password: string;
        userName: string;
    } {
        return {
            email: this.configService.getOrThrow<string>('seed.admin.email'),
            password: this.configService.getOrThrow<string>(
                'seed.admin.password'
            ),
            userName: this.configService.getOrThrow<string>(
                'seed.admin.userName'
            ),
        };
    }
}
