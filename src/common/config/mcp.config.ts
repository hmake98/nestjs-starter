import { registerAs } from '@nestjs/config';

export default registerAs('mcp', () => ({
    serverName: process.env.MCP_SERVER_NAME || 'nestjs-starter-mcp',
    serverVersion: process.env.MCP_SERVER_VERSION || '1.0.0',
    websocket: {
        port: parseInt(process.env.MCP_WS_PORT || '3002', 10),
        host: process.env.MCP_WS_HOST || 'localhost',
    },
}));
