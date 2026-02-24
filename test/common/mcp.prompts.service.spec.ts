import { Test, TestingModule } from '@nestjs/testing';

import { MCPPromptsService } from 'src/common/mcp/services/mcp.prompts.service';

describe('MCPPromptsService', () => {
    let service: MCPPromptsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MCPPromptsService],
        }).compile();

        service = module.get<MCPPromptsService>(MCPPromptsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('codeReview', () => {
        it('should generate code review prompt without focus', async () => {
            const code = 'const sum = (a, b) => a + b;';
            const result = await service.codeReview('TypeScript', code);

            expect(typeof result).toBe('string');
            expect(result).toContain('TypeScript');
            expect(result).toContain(code);
            expect(result).toContain('code quality assessment');
            expect(result).toContain('Security vulnerabilities');
            expect(result).toContain('Performance considerations');
        });

        it('should generate code review prompt with focus', async () => {
            const code = 'def calculate(x): return x * 2';
            const result = await service.codeReview('Python', code, 'security');

            expect(typeof result).toBe('string');
            expect(result).toContain('Python');
            expect(result).toContain(code);
            expect(result).toContain('Focus specifically on: security');
        });

        it('should include all required review points', async () => {
            const result = await service.codeReview(
                'JavaScript',
                'function test() {}'
            );

            expect(result).toContain('Overall code quality assessment');
            expect(result).toContain('Potential bugs or issues');
            expect(result).toContain('Security vulnerabilities');
            expect(result).toContain('Performance considerations');
            expect(result).toContain('Best practices and improvements');
            expect(result).toContain('Code maintainability');
        });
    });

    describe('generateApiDocs', () => {
        it('should generate API docs without request and response bodies', async () => {
            const result = await service.generateApiDocs(
                'GET',
                '/api/users',
                'Get all users'
            );

            expect(typeof result).toBe('string');
            expect(result).toContain('GET');
            expect(result).toContain('/api/users');
            expect(result).toContain('Get all users');
            expect(result).toContain('Detailed endpoint description');
        });

        it('should generate API docs with request body', async () => {
            const requestBody = '{"name": "John", "email": "john@example.com"}';
            const result = await service.generateApiDocs(
                'POST',
                '/api/users',
                'Create a user',
                requestBody
            );

            expect(result).toContain('POST');
            expect(result).toContain('Request Body Example');
            expect(result).toContain(requestBody);
        });

        it('should generate API docs with response body', async () => {
            const responseBody = '{"id": 1, "name": "John"}';
            const result = await service.generateApiDocs(
                'GET',
                '/api/users/1',
                'Get user by ID',
                undefined,
                responseBody
            );

            expect(result).toContain('Response Body Example');
            expect(result).toContain(responseBody);
        });

        it('should generate API docs with both request and response bodies', async () => {
            const requestBody = '{"name": "Jane"}';
            const responseBody = '{"id": 1, "name": "Jane"}';
            const result = await service.generateApiDocs(
                'PUT',
                '/api/users/1',
                'Update user',
                requestBody,
                responseBody
            );

            expect(result).toContain('PUT');
            expect(result).toContain('Request Body Example');
            expect(result).toContain(requestBody);
            expect(result).toContain('Response Body Example');
            expect(result).toContain(responseBody);
        });

        it('should include all required documentation sections', async () => {
            const result = await service.generateApiDocs(
                'DELETE',
                '/api/users/1',
                'Delete user'
            );

            expect(result).toContain('Detailed endpoint description');
            expect(result).toContain('Request parameters and headers');
            expect(result).toContain('Response status codes and meanings');
            expect(result).toContain('Response body schema');
            expect(result).toContain('Example cURL request');
            expect(result).toContain('Error responses');
        });
    });

    describe('generateNestJsService', () => {
        it('should generate NestJS service prompt', async () => {
            const fields = 'name:string,price:number,inStock:boolean';
            const result = await service.generateNestJsService(
                'Product',
                fields
            );

            expect(typeof result).toBe('string');
            expect(result).toContain('Product');
            expect(result).toContain(fields);
        });

        it('should include all required service generation instructions', async () => {
            const result = await service.generateNestJsService(
                'Order',
                'orderId:string,total:number'
            );

            expect(result).toContain(
                'NestJS service class with dependency injection'
            );
            expect(result).toContain('CRUD operations');
            expect(result).toContain(
                'create, findAll, findOne, update, delete'
            );
            expect(result).toContain('TypeScript typing');
            expect(result).toContain('Error handling');
            expect(result).toContain('Prisma ORM');
            expect(result).toContain('JSDoc comments');
            expect(result).toContain('class-validator DTOs');
            expect(result).toContain('NestJS best practices');
        });
    });

    describe('optimizeQuery', () => {
        it('should generate query optimization prompt without schema', async () => {
            const query =
                'SELECT * FROM users WHERE email = "test@example.com"';
            const result = await service.optimizeQuery('PostgreSQL', query);

            expect(typeof result).toBe('string');
            expect(result).toContain('PostgreSQL');
            expect(result).toContain(query);
            expect(result).toContain('query performance');
        });

        it('should generate query optimization prompt with schema', async () => {
            const query = 'SELECT * FROM orders WHERE status = "pending"';
            const schema =
                'users(id, email, created_at), orders(id, user_id, status)';
            const result = await service.optimizeQuery('MySQL', query, schema);

            expect(result).toContain('MySQL');
            expect(result).toContain(query);
            expect(result).toContain('Schema Information');
            expect(result).toContain(schema);
        });

        it('should include all required optimization points', async () => {
            const result = await service.optimizeQuery(
                'MongoDB',
                'db.collection.find({status: "active"})'
            );

            expect(result).toContain(
                'Analysis of the current query performance'
            );
            expect(result).toContain('Recommended indexes');
            expect(result).toContain('Optimized query version');
            expect(result).toContain('Explanation of improvements');
            expect(result).toContain('Additional optimization tips');
        });
    });

    describe('generateUnitTests', () => {
        it('should generate unit tests with default framework', async () => {
            const code = 'function add(a, b) { return a + b; }';
            const result = await service.generateUnitTests(code);

            expect(typeof result).toBe('string');
            expect(result).toContain('Jest');
            expect(result).toContain(code);
        });

        it('should generate unit tests with specified framework', async () => {
            const code = 'class Calculator { add(a, b) { return a + b; } }';
            const result = await service.generateUnitTests(code, 'Mocha');

            expect(result).toContain('Mocha');
            expect(result).toContain(code);
        });

        it('should include all required test generation instructions', async () => {
            const result = await service.generateUnitTests(
                'const multiply = (x, y) => x * y;',
                'Vitest'
            );

            expect(result).toContain('Vitest');
            expect(result).toContain(
                'Complete test suite with describe blocks'
            );
            expect(result).toContain('happy path scenarios');
            expect(result).toContain('edge cases');
            expect(result).toContain('error conditions');
            expect(result).toContain('Mock dependencies');
            expect(result).toContain('Setup and teardown');
            expect(result).toContain('Clear test descriptions');
            expect(result).toContain('Assertions');
            expect(result).toContain('high code coverage');
        });
    });
});
