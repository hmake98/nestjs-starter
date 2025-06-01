import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { Logger as PinoLogger } from 'pino';

import { APP_ENVIRONMENT } from 'src/app/enums/app.enum';

@Injectable()
export class CustomLoggerService implements NestLoggerService {
    private readonly logger: PinoLogger;
    private context = 'Application';

    constructor(private readonly configService: ConfigService) {
        const isLocal =
            this.configService.get('app.env') === APP_ENVIRONMENT.LOCAL;

        this.logger = pino({
            level: this.configService.get('LOG_LEVEL', 'info'),
            transport: isLocal
                ? {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          levelFirst: true,
                          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                          ignore: 'pid,hostname',
                      },
                  }
                : undefined,
            formatters: {
                level: (label: string) => ({ level: label.toUpperCase() }),
            },
            timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
            base: {
                pid: false,
                hostname: false,
                environment: this.configService.get('app.env'),
                service: this.configService.get('app.name'),
            },
        });
    }

    setContext(context: string): void {
        this.context = context;
    }

    log(message: any, context?: string): void {
        this.logger.info({ context: context || this.context }, message);
    }

    error(message: any, trace?: string, context?: string): void {
        this.logger.error(
            {
                context: context || this.context,
                trace,
            },
            message
        );
    }

    warn(message: any, context?: string): void {
        this.logger.warn({ context: context || this.context }, message);
    }

    debug(message: any, context?: string): void {
        this.logger.debug({ context: context || this.context }, message);
    }

    verbose(message: any, context?: string): void {
        this.logger.trace({ context: context || this.context }, message);
    }

    // Additional methods for structured logging
    info(message: string, meta?: any, context?: string): void {
        this.logger.info(
            {
                context: context || this.context,
                ...meta,
            },
            message
        );
    }

    fatal(message: string, meta?: any, context?: string): void {
        this.logger.fatal(
            {
                context: context || this.context,
                ...meta,
            },
            message
        );
    }

    // Method for logging with correlation ID
    logWithCorrelation(
        level: 'info' | 'error' | 'warn' | 'debug',
        message: string,
        correlationId: string,
        meta?: any,
        context?: string
    ): void {
        this.logger[level](
            {
                context: context || this.context,
                correlationId,
                ...meta,
            },
            message
        );
    }

    // Method for performance logging
    logPerformance(
        operation: string,
        duration: number,
        meta?: any,
        context?: string
    ): void {
        this.logger.info(
            {
                context: context || this.context,
                operation,
                duration,
                type: 'performance',
                ...meta,
            },
            `Operation ${operation} completed in ${duration}ms`
        );
    }

    // Method for business event logging
    logBusinessEvent(
        event: string,
        userId?: string,
        meta?: any,
        context?: string
    ): void {
        this.logger.info(
            {
                context: context || this.context,
                event,
                userId,
                type: 'business-event',
                ...meta,
            },
            `Business event: ${event}`
        );
    }
}
