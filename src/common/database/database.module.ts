import { Module } from '@nestjs/common';

import { DatabaseService } from './services/database.service';

@Module({
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
