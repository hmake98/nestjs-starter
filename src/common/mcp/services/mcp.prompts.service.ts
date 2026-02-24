import { Injectable } from '@nestjs/common';
import { Prompt, PromptParam } from '@hmake98/nest-mcp';

@Injectable()
export class MCPPromptsService {
    /**
     * Code review prompt
     */
    @Prompt({
        name: 'code-review',
        description:
            'Generate a comprehensive code review prompt for any programming language',
    })
    async codeReview(
        @PromptParam('language', {
            description: 'Programming language (e.g., TypeScript, Python)',
            required: true,
        })
        language: string,
        @PromptParam('code', {
            description: 'Code snippet to review',
            required: true,
        })
        code: string,
        @PromptParam('focus', {
            description:
                'Specific aspect to focus on (e.g., security, performance)',
            required: false,
        })
        focus?: string
    ): Promise<string> {
        let prompt = `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;

        if (focus) {
            prompt += `Focus specifically on: ${focus}\n\n`;
        }

        prompt += `Please provide:\n`;
        prompt += `1. Overall code quality assessment\n`;
        prompt += `2. Potential bugs or issues\n`;
        prompt += `3. Security vulnerabilities\n`;
        prompt += `4. Performance considerations\n`;
        prompt += `5. Best practices and improvements\n`;
        prompt += `6. Code maintainability`;

        return prompt;
    }

    /**
     * API documentation generator prompt
     */
    @Prompt({
        name: 'generate-api-docs',
        description: 'Generate API documentation for an endpoint',
    })
    async generateApiDocs(
        @PromptParam('method', {
            description: 'HTTP method (GET, POST, PUT, DELETE)',
            required: true,
        })
        method: string,
        @PromptParam('path', {
            description: 'API endpoint path',
            required: true,
        })
        path: string,
        @PromptParam('description', {
            description: 'Endpoint description',
            required: true,
        })
        description: string,
        @PromptParam('requestBody', {
            description: 'Request body example (JSON string)',
            required: false,
        })
        requestBody?: string,
        @PromptParam('responseBody', {
            description: 'Response body example (JSON string)',
            required: false,
        })
        responseBody?: string
    ): Promise<string> {
        let prompt = `Generate comprehensive API documentation for the following endpoint:\n\n`;
        prompt += `**Method:** ${method}\n`;
        prompt += `**Path:** ${path}\n`;
        prompt += `**Description:** ${description}\n\n`;

        if (requestBody) {
            prompt += `**Request Body Example:**\n\`\`\`json\n${requestBody}\n\`\`\`\n\n`;
        }

        if (responseBody) {
            prompt += `**Response Body Example:**\n\`\`\`json\n${responseBody}\n\`\`\`\n\n`;
        }

        prompt += `Please generate:\n`;
        prompt += `1. Detailed endpoint description\n`;
        prompt += `2. Request parameters and headers\n`;
        prompt += `3. Request body schema (if applicable)\n`;
        prompt += `4. Response status codes and meanings\n`;
        prompt += `5. Response body schema\n`;
        prompt += `6. Example cURL request\n`;
        prompt += `7. Error responses`;

        return prompt;
    }

    /**
     * NestJS service generator prompt
     */
    @Prompt({
        name: 'generate-nestjs-service',
        description: 'Generate a NestJS service with CRUD operations',
    })
    async generateNestJsService(
        @PromptParam('entityName', {
            description: 'Name of the entity (e.g., Product, Order)',
            required: true,
        })
        entityName: string,
        @PromptParam('fields', {
            description:
                'Entity fields as comma-separated list (e.g., name:string,price:number)',
            required: true,
        })
        fields: string
    ): Promise<string> {
        const prompt = `Generate a complete NestJS service for the entity "${entityName}" with the following fields:\n\n${fields}\n\n`;

        const instructions = `Please generate:\n
1. A NestJS service class with dependency injection
2. CRUD operations (create, findAll, findOne, update, delete)
3. Proper TypeScript typing
4. Error handling with appropriate exceptions
5. Integration with Prisma ORM
6. JSDoc comments for each method
7. Input validation using class-validator DTOs

Follow NestJS best practices and include proper decorator usage.`;

        return prompt + instructions;
    }

    /**
     * Database query optimization prompt
     */
    @Prompt({
        name: 'optimize-query',
        description: 'Get suggestions for optimizing a database query',
    })
    async optimizeQuery(
        @PromptParam('database', {
            description: 'Database type (PostgreSQL, MySQL, MongoDB)',
            required: true,
        })
        database: string,
        @PromptParam('query', {
            description: 'The query to optimize',
            required: true,
        })
        query: string,
        @PromptParam('schema', {
            description: 'Table/collection schema information',
            required: false,
        })
        schema?: string
    ): Promise<string> {
        let prompt = `Optimize this ${database} query:\n\n\`\`\`sql\n${query}\n\`\`\`\n\n`;

        if (schema) {
            prompt += `**Schema Information:**\n${schema}\n\n`;
        }

        prompt += `Please provide:\n`;
        prompt += `1. Analysis of the current query performance\n`;
        prompt += `2. Recommended indexes\n`;
        prompt += `3. Optimized query version\n`;
        prompt += `4. Explanation of improvements\n`;
        prompt += `5. Additional optimization tips`;

        return prompt;
    }

    /**
     * Unit test generator prompt
     */
    @Prompt({
        name: 'generate-unit-tests',
        description: 'Generate unit tests for a function or class',
    })
    async generateUnitTests(
        @PromptParam('code', {
            description: 'The code to test',
            required: true,
        })
        code: string,
        @PromptParam('framework', {
            description: 'Testing framework (Jest, Mocha, Vitest)',
            required: false,
        })
        framework?: string
    ): Promise<string> {
        const fw = framework || 'Jest';
        const prompt = `Generate comprehensive unit tests using ${fw} for the following code:\n\n\`\`\`typescript\n${code}\n\`\`\`\n\n`;

        const instructions = `Please generate:\n
1. Complete test suite with describe blocks
2. Test cases for normal/happy path scenarios
3. Test cases for edge cases
4. Test cases for error conditions
5. Mock dependencies where needed
6. Setup and teardown if required
7. Clear test descriptions
8. Assertions with expected behavior

Use ${fw} best practices and maintain high code coverage.`;

        return prompt + instructions;
    }
}
