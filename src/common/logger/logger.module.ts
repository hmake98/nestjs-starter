import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { createLoggerConfig } from '../config/logger.config';

import { CustomLoggerService } from './services/logger.service';

@Global()
@Module({
    imports: [
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: createLoggerConfig,
        }),
    ],
    providers: [CustomLoggerService],
    exports: [CustomLoggerService],
})
export class CustomLoggerModule {}
