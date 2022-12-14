import { Injectable, Scope } from "@nestjs/common";
// import { Cron } from '@nestjs/schedule';

@Injectable({ scope: Scope.DEFAULT })
export class TaskService {
  constructor() {}
  /**
   * Cron run at every 45 seconds
   */
  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  // }
}
