import { Module } from '@nestjs/common';

import { LoggerService } from './services/logger.service';

@Module({
    exports: [LoggerService],
    providers: [LoggerService],
})
export class LoggerModule {}
