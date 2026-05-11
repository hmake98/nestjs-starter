import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { MidNightScheduleWorker } from './schedulers/midnight.scheduler';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [MidNightScheduleWorker],
})
export class WorkerModule {}
