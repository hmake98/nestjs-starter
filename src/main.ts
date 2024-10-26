import 'reflect-metadata';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { APP_ENVIRONMENT } from './app/enums/app.enum';
import { LoggerService } from './common/logger/services/logger.service';
import setupSwagger from './swagger';

async function bootstrap(): Promise<void> {
    const server = express();

    try {
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server),
            {
                bufferLogs: true,
                logger: false,
            }
        );

        const config = app.get(ConfigService);
        const env = config.get<string>('app.env');
        const isLocal = env === APP_ENVIRONMENT.LOCAL;

        if (isLocal) {
            app.useLogger(new Logger());
        } else {
            const cloudLogger = app.get(LoggerService);
            app.useLogger(cloudLogger);
        }

        const logger = isLocal ? new Logger() : app.get(LoggerService);
        const host = config.getOrThrow<string>('app.http.host');
        const port = config.getOrThrow<number>('app.http.port');

        // Basic middleware
        app.use(helmet());
        app.use(compression());
        app.enableCors(config.get('app.cors'));

        // Validation and API settings
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.setGlobalPrefix('api');
        app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
        useContainer(app.select(AppModule), { fallbackOnErrors: true });

        // Swagger for non-production environments
        if (env !== APP_ENVIRONMENT.PRODUCTION) {
            setupSwagger(app);
        }

        // Start server
        await app.listen(port, host);
        logger.log(`🚀 Server running on: ${await app.getUrl()}`);
        logger.log(`📖 Docs served on: ${await app.getUrl()}/docs`);
    } catch (error) {
        console.error('Failed to start:', error);
        process.exit(1);
    }
}

bootstrap();
