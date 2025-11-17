import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { HelperModule } from 'src/common/helper/helper.module';

import { EmailProcessorWorker } from './processors/email.processor';
import { MidNightScheduleWorker } from './schedulers/midnight.scheduler';

@Module({
    imports: [HelperModule, ScheduleModule.forRoot()],
    providers: [MidNightScheduleWorker, EmailProcessorWorker],
    exports: [MidNightScheduleWorker, EmailProcessorWorker],
})
export class WorkerModule {}
