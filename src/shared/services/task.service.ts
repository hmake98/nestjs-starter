import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable({ scope: Scope.DEFAULT })
export class TaskService {
  constructor(private logger: LoggerService) {}
  /**
   * Cron run at every 45 seconds
   */
  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
