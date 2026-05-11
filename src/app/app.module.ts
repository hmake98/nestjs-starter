import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { WorkerModule } from 'src/workers/worker.module';

import configs from './config';
import { HealthController } from './controllers/health.controller';

@Module({
    imports: [
        // Configuration - Global
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
        }),
        // Health Check
        TerminusModule,

        // Shared Common Services
        CommonModule,

        // Background Processing
        WorkerModule,

        // Feature Modules
        AuthModule,
        UserModule,
    ],
    controllers: [HealthController],
})
export class AppModule {}
