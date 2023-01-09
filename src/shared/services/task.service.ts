import { Injectable, Logger, Scope } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable({ scope: Scope.DEFAULT })
export class TaskService {
  logger = new Logger();
  /**
   * Cron run at every 45 seconds
   */
  @Cron('0 0 * * * *')
  handleCron() {
    this.logger.log('Called when at 12 midnight');
  }
}
