import { Injectable } from '@nestjs/common';
import { MCPPrompt } from '@hmake98/nestjs-mcp';

@Injectable()
export class MCPPromptsService {
    /**
     * Code review prompt
     */
    @MCPPrompt({
        name: 'code-review',
        description:
            'Generate a comprehensive code review prompt for any programming language',
        arguments: [
            {
                name: 'language',
                description: 'Programming language (e.g., TypeScript, Python)',
                required: true,
            },
            {
                name: 'code',
                description: 'Code snippet to review',
                required: true,
            },
            {
                name: 'focus',
                description:
                    'Specific aspect to focus on (e.g., security, performance)',
                required: false,
            },
        ],
    })
    async codeReview(args: { language: string; code: string; focus?: string }) {
        let prompt = `Please review this ${args.language} code:\n\n\`\`\`${args.language}\n${args.code}\n\`\`\`\n\n`;

        if (args.focus) {
            prompt += `Focus specifically on: ${args.focus}\n\n`;
        }

        prompt += `Please provide:\n`;
        prompt += `1. Overall code quality assessment\n`;
        prompt += `2. Potential bugs or issues\n`;
        prompt += `3. Security vulnerabilities\n`;
        prompt += `4. Performance considerations\n`;
        prompt += `5. Best practices and improvements\n`;
        prompt += `6. Code maintainability`;

        return [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: prompt,
                },
            },
        ];
    }

    /**
     * API documentation generator prompt
     */
    @MCPPrompt({
        name: 'generate-api-docs',
        description: 'Generate API documentation for an endpoint',
        arguments: [
            {
                name: 'method',
                description: 'HTTP method (GET, POST, PUT, DELETE)',
                required: true,
            },
            { name: 'path', description: 'API endpoint path', required: true },
            {
                name: 'description',
                description: 'Endpoint description',
                required: true,
            },
            {
                name: 'requestBody',
                description: 'Request body example (JSON string)',
                required: false,
            },
            {
                name: 'responseBody',
                description: 'Response body example (JSON string)',
                required: false,
            },
        ],
    })
    async generateApiDocs(args: {
        method: string;
        path: string;
        description: string;
        requestBody?: string;
        responseBody?: string;
    }) {
        let prompt = `Generate comprehensive API documentation for the following endpoint:\n\n`;
        prompt += `**Method:** ${args.method}\n`;
        prompt += `**Path:** ${args.path}\n`;
        prompt += `**Description:** ${args.description}\n\n`;

        if (args.requestBody) {
            prompt += `**Request Body Example:**\n\`\`\`json\n${args.requestBody}\n\`\`\`\n\n`;
        }

        if (args.responseBody) {
            prompt += `**Response Body Example:**\n\`\`\`json\n${args.responseBody}\n\`\`\`\n\n`;
        }

        prompt += `Please generate:\n`;
        prompt += `1. Detailed endpoint description\n`;
        prompt += `2. Request parameters and headers\n`;
        prompt += `3. Request body schema (if applicable)\n`;
        prompt += `4. Response status codes and meanings\n`;
        prompt += `5. Response body schema\n`;
        prompt += `6. Example cURL request\n`;
        prompt += `7. Error responses`;

        return [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: prompt,
                },
            },
        ];
    }

    /**
     * NestJS service generator prompt
     */
    @MCPPrompt({
        name: 'generate-nestjs-service',
        description: 'Generate a NestJS service with CRUD operations',
        arguments: [
            {
                name: 'entityName',
                description: 'Name of the entity (e.g., Product, Order)',
                required: true,
            },
            {
                name: 'fields',
                description:
                    'Entity fields as comma-separated list (e.g., name:string,price:number)',
                required: true,
            },
        ],
    })
    async generateNestJsService(args: { entityName: string; fields: string }) {
        const prompt = `Generate a complete NestJS service for the entity "${args.entityName}" with the following fields:\n\n${args.fields}\n\n`;

        const instructions = `Please generate:\n
1. A NestJS service class with dependency injection
2. CRUD operations (create, findAll, findOne, update, delete)
3. Proper TypeScript typing
4. Error handling with appropriate exceptions
5. Integration with Prisma ORM
6. JSDoc comments for each method
7. Input validation using class-validator DTOs

Follow NestJS best practices and include proper decorator usage.`;

        return [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: prompt + instructions,
                },
            },
        ];
    }

    /**
     * Database query optimization prompt
     */
    @MCPPrompt({
        name: 'optimize-query',
        description: 'Get suggestions for optimizing a database query',
        arguments: [
            {
                name: 'database',
                description: 'Database type (PostgreSQL, MySQL, MongoDB)',
                required: true,
            },
            {
                name: 'query',
                description: 'The query to optimize',
                required: true,
            },
            {
                name: 'schema',
                description: 'Table/collection schema information',
                required: false,
            },
        ],
    })
    async optimizeQuery(args: {
        database: string;
        query: string;
        schema?: string;
    }) {
        let prompt = `Optimize this ${args.database} query:\n\n\`\`\`sql\n${args.query}\n\`\`\`\n\n`;

        if (args.schema) {
            prompt += `**Schema Information:**\n${args.schema}\n\n`;
        }

        prompt += `Please provide:\n`;
        prompt += `1. Analysis of the current query performance\n`;
        prompt += `2. Recommended indexes\n`;
        prompt += `3. Optimized query version\n`;
        prompt += `4. Explanation of improvements\n`;
        prompt += `5. Additional optimization tips`;

        return [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: prompt,
                },
            },
        ];
    }

    /**
     * Unit test generator prompt
     */
    @MCPPrompt({
        name: 'generate-unit-tests',
        description: 'Generate unit tests for a function or class',
        arguments: [
            { name: 'code', description: 'The code to test', required: true },
            {
                name: 'framework',
                description: 'Testing framework (Jest, Mocha, Vitest)',
                required: false,
            },
        ],
    })
    async generateUnitTests(args: { code: string; framework?: string }) {
        const framework = args.framework || 'Jest';
        const prompt = `Generate comprehensive unit tests using ${framework} for the following code:\n\n\`\`\`typescript\n${args.code}\n\`\`\`\n\n`;

        const instructions = `Please generate:\n
1. Complete test suite with describe blocks
2. Test cases for normal/happy path scenarios
3. Test cases for edge cases
4. Test cases for error conditions
5. Mock dependencies where needed
6. Setup and teardown if required
7. Clear test descriptions
8. Assertions with expected behavior

Use ${framework} best practices and maintain high code coverage.`;

        return [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: prompt + instructions,
                },
            },
        ];
    }
}
