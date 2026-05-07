import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { createLoggerConfig } from './services/logger.service';

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
