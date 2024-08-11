import 'reflect-metadata';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import express from 'express';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import setupSwagger from './swagger';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      cors: true,
      logger: ['error', 'warn', 'log'],
    });

    server.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        message: 'Hello, welcome to nestjs starter!',
      });
    });

    const configService = app.get(ConfigService);

    // App configuration
    const host = configService.get<string>('app.http.host', 'localhost');
    const port = configService.get<number>('app.http.port', 3000);
    const globalPrefix = configService.get<string>('app.globalPrefix', 'api');
    const versioningPrefix = configService.get<string>('app.versioning.prefix', 'v');
    const version = configService.get<string>('app.versioning.version', '1');
    const versionEnable = configService.get<boolean>('app.versioning.enable', true);

    // Security
    app.use(helmet());

    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Prefix and versioning
    app.setGlobalPrefix(globalPrefix);
    if (versionEnable) {
      app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: version,
        prefix: versioningPrefix,
      });
    }

    // Setup DI container for class-validator
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Swagger setup
    await setupSwagger(app);

    await app.listen(port, host);
    logger.log(`🚀 Server is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error('Unhandled error during bootstrap:', error);
  process.exit(1);
});
