import * as bunyan from 'bunyan';
import { LoggerService } from '@nestjs/common';

export class LogService implements LoggerService {
  private logger;

  constructor() {
    this.logger = bunyan.createLogger({
      name: 'app',
      src: true,
      streams: [
        {
          level: 'info',
          stream: process.stdout,
        },
        {
          level: 'error',
          path: 'error.log',
        },
      ],
    });
  }

  public log(message: string) {
    this.logger.info(message);
  }

  public error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  public warn(message: string) {
    this.logger.warn(message);
  }
}
