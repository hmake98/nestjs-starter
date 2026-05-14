import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';

import { ScriptsModule } from './scripts/scripts.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(ScriptsModule, {
        logger: ['error', 'warn', 'log'],
    });

    try {
        await app.select(CommandModule).get(CommandService).exec();
    } catch (err) {
        new Logger('CLI').error(err);
        process.exitCode = 1;
    } finally {
        await app.close();
    }
}

bootstrap().catch(err => {
    console.error('CLI failed to start:', err);
    process.exit(1);
});
