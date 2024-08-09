import { Module } from '@nestjs/common';

import { CronProcessorService } from './processors/cron.processor.service';

@Module({
  providers: [CronProcessorService],
  exports: [CronProcessorService],
})
export class WorkerModule {}
