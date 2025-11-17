import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { createLoggerConfig } from './services/logger.service';

/**
 * Global logger module using Pino for structured logging
 *
 * This module provides:
 * - nestjs-pino Logger service available globally
 * - Automatic HTTP request/response logging
 * - Environment-based configuration (pretty logs in local, JSON in production)
 * - Correlation ID tracking for distributed tracing
 *
 * Usage in any service:
 * ```typescript
 * import { Logger } from 'nestjs-pino';
 *
 * @Injectable()
 * export class MyService {
 *   constructor(private readonly logger: Logger) {
 *     this.logger.setContext(MyService.name);
 *   }
 * }
 * ```
 */
@Global()
@Module({
    imports: [
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: createLoggerConfig,
        }),
    ],
    exports: [LoggerModule],
})
export class CustomLoggerModule {}
