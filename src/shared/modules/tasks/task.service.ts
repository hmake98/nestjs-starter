import { Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  /**
   * Cron run at every 45 seconds
   */
  // @Cron('45 * * * * *')
  // handleCron() {
  // this.logger.debug('Called when the current second is 45');
  // }
}
