import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { CommonModule } from 'src/common/common.module';

import { EmailMigrationSeed } from './seed/email.seed';

@Module({
    imports: [CommonModule, CommandModule],
    providers: [EmailMigrationSeed],
    exports: [EmailMigrationSeed],
})
export class MigrationModule {}
