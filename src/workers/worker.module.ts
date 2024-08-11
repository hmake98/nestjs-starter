import { Module } from '@nestjs/common';

import { HelperModule } from 'src/common/helper/helper.module';

import { CronProcessorWorkerService } from './processors/cron.processor.service';
import { EmailProcessorWorkerService } from './processors/email.processor.service';

@Module({
  imports: [HelperModule],
  providers: [CronProcessorWorkerService, EmailProcessorWorkerService],
  exports: [CronProcessorWorkerService, EmailProcessorWorkerService],
})
export class WorkerModule {}
