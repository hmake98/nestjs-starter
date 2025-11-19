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
            const args = {
                language: 'TypeScript',
                code: 'const sum = (a, b) => a + b;',
            };

            const result = await service.codeReview(args);

            expect(result).toHaveLength(1);
            expect(result[0].role).toBe('user');
            expect(result[0].content.type).toBe('text');
            expect(result[0].content.text).toContain('TypeScript');
            expect(result[0].content.text).toContain(args.code);
            expect(result[0].content.text).toContain('code quality assessment');
            expect(result[0].content.text).toContain(
                'Security vulnerabilities'
            );
            expect(result[0].content.text).toContain(
                'Performance considerations'
            );
        });

        it('should generate code review prompt with focus', async () => {
            const args = {
                language: 'Python',
                code: 'def calculate(x): return x * 2',
                focus: 'security',
            };

            const result = await service.codeReview(args);

            expect(result).toHaveLength(1);
            expect(result[0].role).toBe('user');
            expect(result[0].content.text).toContain('Python');
            expect(result[0].content.text).toContain(args.code);
            expect(result[0].content.text).toContain(
                'Focus specifically on: security'
            );
        });

        it('should include all required review points', async () => {
            const args = {
                language: 'JavaScript',
                code: 'function test() {}',
            };

            const result = await service.codeReview(args);
            const text = result[0].content.text;

            expect(text).toContain('Overall code quality assessment');
            expect(text).toContain('Potential bugs or issues');
            expect(text).toContain('Security vulnerabilities');
            expect(text).toContain('Performance considerations');
            expect(text).toContain('Best practices and improvements');
            expect(text).toContain('Code maintainability');
        });
    });

    describe('generateApiDocs', () => {
        it('should generate API docs without request and response bodies', async () => {
            const args = {
                method: 'GET',
                path: '/api/users',
                description: 'Get all users',
            };

            const result = await service.generateApiDocs(args);

            expect(result).toHaveLength(1);
            expect(result[0].role).toBe('user');
            expect(result[0].content.type).toBe('text');
            expect(result[0].content.text).toContain('GET');
            expect(result[0].content.text).toContain('/api/users');
            expect(result[0].content.text).toContain('Get all users');
            expect(result[0].content.text).toContain(
                'Detailed endpoint description'
            );
        });

        it('should generate API docs with request body', async () => {
            const args = {
                method: 'POST',
                path: '/api/users',
                description: 'Create a user',
                requestBody: '{"name": "John", "email": "john@example.com"}',
            };

            const result = await service.generateApiDocs(args);

            expect(result[0].content.text).toContain('POST');
            expect(result[0].content.text).toContain('Request Body Example');
            expect(result[0].content.text).toContain(args.requestBody);
        });

        it('should generate API docs with response body', async () => {
            const args = {
                method: 'GET',
                path: '/api/users/1',
                description: 'Get user by ID',
                responseBody: '{"id": 1, "name": "John"}',
            };

            const result = await service.generateApiDocs(args);

            expect(result[0].content.text).toContain('Response Body Example');
            expect(result[0].content.text).toContain(args.responseBody);
        });

        it('should generate API docs with both request and response bodies', async () => {
            const args = {
                method: 'PUT',
                path: '/api/users/1',
                description: 'Update user',
                requestBody: '{"name": "Jane"}',
                responseBody: '{"id": 1, "name": "Jane"}',
            };

            const result = await service.generateApiDocs(args);
            const text = result[0].content.text;

            expect(text).toContain('PUT');
            expect(text).toContain('Request Body Example');
            expect(text).toContain(args.requestBody);
            expect(text).toContain('Response Body Example');
            expect(text).toContain(args.responseBody);
        });

        it('should include all required documentation sections', async () => {
            const args = {
                method: 'DELETE',
                path: '/api/users/1',
                description: 'Delete user',
            };

            const result = await service.generateApiDocs(args);
            const text = result[0].content.text;

            expect(text).toContain('Detailed endpoint description');
            expect(text).toContain('Request parameters and headers');
            expect(text).toContain('Response status codes and meanings');
            expect(text).toContain('Response body schema');
            expect(text).toContain('Example cURL request');
            expect(text).toContain('Error responses');
        });
    });

    describe('generateNestJsService', () => {
        it('should generate NestJS service prompt', async () => {
            const args = {
                entityName: 'Product',
                fields: 'name:string,price:number,inStock:boolean',
            };

            const result = await service.generateNestJsService(args);

            expect(result).toHaveLength(1);
            expect(result[0].role).toBe('user');
            expect(result[0].content.type).toBe('text');
            expect(result[0].content.text).toContain('Product');
            expect(result[0].content.text).toContain(args.fields);
        });

        it('should include all required service generation instructions', async () => {
            const args = {
                entityName: 'Order',
                fields: 'orderId:string,total:number',
            };

            const result = await service.generateNestJsService(args);
            const text = result[0].content.text;

            expect(text).toContain(
                'NestJS service class with dependency injection'
            );
            expect(text).toContain('CRUD operations');
            expect(text).toContain('create, findAll, findOne, update, delete');
            expect(text).toContain('TypeScript typing');
            expect(text).toContain('Error handling');
            expect(text).toContain('Prisma ORM');
            expect(text).toContain('JSDoc comments');
            expect(text).toContain('class-validator DTOs');
            expect(text).toContain('NestJS best practices');
        });
    });

    describe('optimizeQuery', () => {
        it('should generate query optimization prompt without schema', async () => {
            const args = {
                database: 'PostgreSQL',
                query: 'SELECT * FROM users WHERE email = "test@example.com"',
            };

            const result = await service.optimizeQuery(args);

            expect(result).toHaveLength(1);
            expect(result[0].role).toBe('user');
            expect(result[0].content.type).toBe('text');
            expect(result[0].content.text).toContain('PostgreSQL');
            expect(result[0].content.text).toContain(args.query);
            expect(result[0].content.text).toContain('query performance');
        });

        it('should generate query optimization prompt with schema', async () => {
            const args = {
                database: 'MySQL',
                query: 'SELECT * FROM orders WHERE status = "pending"',
                schema: 'users(id, email, created_at), orders(id, user_id, status)',
            };

            const result = await service.optimizeQuery(args);
            const text = result[0].content.text;

            expect(text).toContain('MySQL');
            expect(text).toContain(args.query);
            expect(text).toContain('Schema Information');
            expect(text).toContain(args.schema);
        });

        it('should include all required optimization points', async () => {
            const args = {
                database: 'MongoDB',
                query: 'db.collection.find({status: "active"})',
            };

            const result = await service.optimizeQuery(args);
            const text = result[0].content.text;

            expect(text).toContain('Analysis of the current query performance');
            expect(text).toContain('Recommended indexes');
            expect(text).toContain('Optimized query version');
            expect(text).toContain('Explanation of improvements');
            expect(text).toContain('Additional optimization tips');
        });
    });

    describe('generateUnitTests', () => {
        it('should generate unit tests with default framework', async () => {
            const args = {
                code: 'function add(a, b) { return a + b; }',
            };

            const result = await service.generateUnitTests(args);

            expect(result).toHaveLength(1);
            expect(result[0].role).toBe('user');
            expect(result[0].content.type).toBe('text');
            expect(result[0].content.text).toContain('Jest');
            expect(result[0].content.text).toContain(args.code);
        });

        it('should generate unit tests with specified framework', async () => {
            const args = {
                code: 'class Calculator { add(a, b) { return a + b; } }',
                framework: 'Mocha',
            };

            const result = await service.generateUnitTests(args);
            const text = result[0].content.text;

            expect(text).toContain('Mocha');
            expect(text).toContain(args.code);
        });

        it('should include all required test generation instructions', async () => {
            const args = {
                code: 'const multiply = (x, y) => x * y;',
                framework: 'Vitest',
            };

            const result = await service.generateUnitTests(args);
            const text = result[0].content.text;

            expect(text).toContain('Vitest');
            expect(text).toContain('Complete test suite with describe blocks');
            expect(text).toContain('happy path scenarios');
            expect(text).toContain('edge cases');
            expect(text).toContain('error conditions');
            expect(text).toContain('Mock dependencies');
            expect(text).toContain('Setup and teardown');
            expect(text).toContain('Clear test descriptions');
            expect(text).toContain('Assertions');
            expect(text).toContain('high code coverage');
        });
    });
});
