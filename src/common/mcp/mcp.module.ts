import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MCPModule as NestMCPModule } from '@hmake98/nestjs-mcp';

import { PUBLIC_ROUTE_KEY } from 'src/common/request/constants/request.constant';
import { MCPPromptsService } from './services/mcp.prompts.service';
import { MCPResourcesService } from './services/mcp.resources.service';
import { MCPToolsService } from './services/mcp.tools.service';

@Module({
    imports: [
        NestMCPModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            // These options must be provided at module level due to NestJS limitations
            publicMetadataKey: PUBLIC_ROUTE_KEY,
            rootPath: true,
            useFactory: async (configService: ConfigService) => ({
                serverInfo: {
                    name: configService.get(
                        'mcp.serverName',
                        'nestjs-starter-mcp'
                    ),
                    version: configService.get('mcp.serverVersion', '1.0.0'),
                },
                // Auto-discover decorated tools, resources, and prompts
                autoDiscoverTools: true,
                autoDiscoverResources: true,
                autoDiscoverPrompts: true,
                // Logging level
                logLevel: configService.get('mcp.logLevel', 'info'),
            }),
        }),
    ],
    providers: [MCPToolsService, MCPResourcesService, MCPPromptsService],
    exports: [MCPToolsService, MCPResourcesService, MCPPromptsService],
})
export class MCPCommonModule {}
