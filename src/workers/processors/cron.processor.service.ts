import { Injectable, Logger, Scope } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable({ scope: Scope.DEFAULT })
export class CronProcessorService {
  private logger = new Logger(CronProcessorService.name);

  @Cron('0 0 * * *')
  handleCron() {
    this.logger.log('12 midnight');
  }
}
