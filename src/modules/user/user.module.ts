import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/common/database/database.module';

import { UserAdminController } from './controllers/user.admin.controller';
import { UserPublicController } from './controllers/user.public.controller';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UserAdminController, UserPublicController],
    providers: [
        UserService,
        // Bind the abstract repository to the Prisma implementation. Swap this
        // line to change ORM (e.g. `useClass: UserTypeOrmRepository`).
        { provide: UserRepository, useClass: UserPrismaRepository },
    ],
    exports: [UserService, UserRepository],
})
export class UserModule {}
