import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MCPModule as NestMCPModule } from '@hmake98/nestjs-mcp';

import { MCPPromptsService } from './services/mcp.prompts.service';
import { MCPResourcesService } from './services/mcp.resources.service';
import { MCPToolsService } from './services/mcp.tools.service';

@Module({
    imports: [
        NestMCPModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            rootPath: true, // Use VERSION_NEUTRAL to bypass versioning and global prefix
            useFactory: async (configService: ConfigService) => ({
                serverInfo: {
                    name: configService.get('mcp.serverName'),
                    version: configService.get('mcp.serverVersion'),
                },
                // Auto-discover decorated tools, resources, and prompts
                autoDiscoverTools: true,
                autoDiscoverResources: true,
                autoDiscoverPrompts: true,
                // Logging level
                logLevel: configService.get('mcp.logLevel'),
            }),
        }),
    ],
    providers: [MCPToolsService, MCPResourcesService, MCPPromptsService],
    exports: [MCPToolsService, MCPResourcesService, MCPPromptsService],
})
export class MCPCommonModule {}
