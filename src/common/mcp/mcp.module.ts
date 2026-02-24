import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { McpModule } from '@hmake98/nest-mcp';

import { MCPPromptsService } from './services/mcp.prompts.service';
import { MCPResourcesService } from './services/mcp.resources.service';
import { MCPToolsService } from './services/mcp.tools.service';

@Module({
    imports: [
        McpModule.registerAsync({
            // ConfigService is globally available via CommonModule's ConfigModule.forRoot({ isGlobal: true })
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: 'websocket',
                serverName: configService.get<string>('mcp.serverName'),
                serverVersion: configService.get<string>('mcp.serverVersion'),
                enablePlayground: true,
                websocket: {
                    port: configService.get<number>('mcp.websocket.port'),
                    host: configService.get<string>('mcp.websocket.host'),
                },
            }),
        }),
    ],
    providers: [MCPToolsService, MCPResourcesService, MCPPromptsService],
    exports: [MCPToolsService, MCPResourcesService, MCPPromptsService],
})
export class MCPCommonModule {}
