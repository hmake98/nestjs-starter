import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { CommonModule } from 'src/common/common.module';

import { EmailSeed } from './seed/email.seed';

@Module({
  imports: [CommonModule, CommandModule],
  providers: [EmailSeed],
  exports: [EmailSeed],
})
export class MigrationModule {}
