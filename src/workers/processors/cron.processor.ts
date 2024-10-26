import { Injectable, Logger, Scope } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable({ scope: Scope.DEFAULT })
export class CronProcessorWorker {
    private logger = new Logger(CronProcessorWorker.name);

    @Cron('0 0 * * *')
    handleCron() {
        this.logger.log('Task to be run at 12 midnight');
    }
}
