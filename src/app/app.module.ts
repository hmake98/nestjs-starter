import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from 'src/common/common.module';
import { PostModule } from 'src/modules/post/post.module';
import { UserModule } from 'src/modules/user/user.module';
import { WorkerModule } from 'src/workers/worker.module';
import { MCPCommonModule } from 'src/common/mcp/mcp.module';

import { HealthController } from './controllers/health.controller';
@Module({
    imports: [
        // Shared Common Services
        CommonModule,

        // MCP Integration
        MCPCommonModule,

        // Background Processing
        WorkerModule,

        // Health Check
        TerminusModule,

        // Feature Modules
        PostModule,
        UserModule,
    ],
    controllers: [HealthController],
})
export class AppModule {}
