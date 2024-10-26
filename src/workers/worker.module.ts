import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { HelperModule } from 'src/common/helper/helper.module';

import { CronProcessorWorker } from './processors/cron.processor';
import { EmailProcessorWorker } from './processors/email.processor';

@Module({
    imports: [HelperModule, ScheduleModule.forRoot()],
    providers: [CronProcessorWorker, EmailProcessorWorker],
    exports: [CronProcessorWorker, EmailProcessorWorker],
})
export class WorkerModule {}
