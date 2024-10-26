// logger.service.ts
import { Injectable, LoggerService as LogService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { Logger as PinoLogger } from 'pino';

@Injectable()
export class LoggerService implements LogService {
    private logger: PinoLogger;

    constructor(private configService: ConfigService) {
        this.logger = pino({
            level: this.configService.get<string>('app.logLevel'),
            formatters: {
                level: label => ({ level: label }),
            },
            timestamp: () =>
                `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
            messageKey: 'message',
            base: {
                environment: this.configService.get<string>('app.env'),
                service: this.configService.get<string>('app.name'),
            },
            redact: ['req.headers.authorization'],
        });
    }

    log(message: any, context?: string): void {
        this.logger.info({ context }, message);
    }

    error(message: any, trace?: string, context?: string): void {
        this.logger.error({ context, trace }, message);
    }

    warn(message: any, context?: string): void {
        this.logger.warn({ context }, message);
    }

    debug(message: any, context?: string): void {
        this.logger.debug({ context }, message);
    }

    verbose(message: any, context?: string): void {
        this.logger.trace({ context }, message);
    }

    logError(error: Error, context?: string): void {
        this.logger.error(
            {
                context,
                error: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                },
            },
            'Error occurred'
        );
    }
}
