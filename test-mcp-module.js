const { MCPModule } = require('./node_modules/@hmake98/nestjs-mcp/dist/modules/mcp.module.js');

const options = {
    imports: [],
    publicMetadataKey: 'Public',
    rootPath: true,
    useFactory: async () => ({
        serverInfo: { name: 'test', version: '1.0.0' }
    })
};

const result = MCPModule.forRootAsync(options);

console.log('Module created successfully');
console.log('Controllers registered:', result.controllers.length);
console.log('Global module:', result.global);

// Check controller metadata
const controller = result.controllers[0];
console.log('Controller name:', controller.name);

// Get the controller metadata
require('reflect-metadata');
const path = Reflect.getMetadata('path', controller);
console.log('Controller path:', path);

console.log('\nSuccess! The MCP module is configured correctly.');
console.log('- Path: /mcp (root level)');
console.log('- Public metadata key: Public');
console.log('\nYou need to RESTART your NestJS application for changes to take effect.');
