import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { WorkerModule } from 'src/workers/worker.module';

import { HealthController } from './controllers/health.controller';

@Module({
    imports: [
        // Shared Common Services (includes ConfigModule)
        CommonModule,

        // Health Check
        TerminusModule,

        // Background Processing
        WorkerModule,

        // Feature Modules
        AuthModule,
        UserModule,
    ],
    controllers: [HealthController],
})
export class AppModule {}
