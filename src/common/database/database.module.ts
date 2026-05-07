import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserRepository } from './repositories/user.repository';
import { DatabaseService } from './services/database.service';

@Module({
    imports: [ConfigModule],
    providers: [DatabaseService, UserRepository],
    exports: [DatabaseService, UserRepository],
})
export class DatabaseModule {}
