import { Injectable, Logger, Scope } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable({ scope: Scope.DEFAULT })
export class CronProcessorWorkerService {
  private logger = new Logger(CronProcessorWorkerService.name);

  @Cron('0 0 * * *')
  handleCron() {
    this.logger.log('Task to be run at 12 midnight');
  }
}
