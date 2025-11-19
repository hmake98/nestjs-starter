import { Test, TestingModule } from '@nestjs/testing';

import { MCPResourcesService } from 'src/common/mcp/services/mcp.resources.service';

describe('MCPResourcesService', () => {
    let service: MCPResourcesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MCPResourcesService],
        }).compile();

        service = module.get<MCPResourcesService>(MCPResourcesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getApiOverview', () => {
        it('should return API overview resource', async () => {
            const result = await service.getApiOverview();

            expect(result).toBeDefined();
            expect(result.uri).toBe('docs://api/overview');
            expect(result.mimeType).toBe('text/markdown');
            expect(result.text).toBeDefined();
        });

        it('should include NestJS Starter API title', async () => {
            const result = await service.getApiOverview();

            expect(result.text).toContain('# NestJS Starter API');
        });

        it('should include features section', async () => {
            const result = await service.getApiOverview();
            const text = result.text;

            expect(text).toContain('## Features');
            expect(text).toContain('Authentication & Authorization (JWT)');
            expect(text).toContain(
                'Database Integration (PostgreSQL + Prisma)'
            );
            expect(text).toContain('Email Service (AWS SES)');
            expect(text).toContain('File Upload (AWS S3)');
            expect(text).toContain('Background Jobs (Bull + Redis)');
            expect(text).toContain('API Documentation (Swagger)');
            expect(text).toContain('Logging (Pino)');
            expect(text).toContain('Rate Limiting');
            expect(text).toContain('Health Checks');
        });

        it('should include endpoints section', async () => {
            const result = await service.getApiOverview();
            const text = result.text;

            expect(text).toContain('## Endpoints');
            expect(text).toContain('/v1/auth/*');
            expect(text).toContain('/v1/user/*');
            expect(text).toContain('/v1/post/*');
            expect(text).toContain('/health');
            expect(text).toContain('/docs');
        });
    });

    describe('getServerStatus', () => {
        it('should return server status resource', async () => {
            const result = await service.getServerStatus();

            expect(result).toBeDefined();
            expect(result.uri).toBe('status://server');
            expect(result.mimeType).toBe('application/json');
            expect(result.text).toBeDefined();
        });

        it('should return valid JSON', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result.text);

            expect(parsed).toBeDefined();
            expect(typeof parsed).toBe('object');
        });

        it('should include status field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result.text);

            expect(parsed.status).toBe('running');
        });

        it('should include environment field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result.text);

            expect(parsed.environment).toBeDefined();
            expect(typeof parsed.environment).toBe('string');
        });

        it('should include nodeVersion field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result.text);

            expect(parsed.nodeVersion).toBe(process.version);
        });

        it('should include platform field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result.text);

            expect(parsed.platform).toBe(process.platform);
        });

        it('should include uptime field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result.text);

            expect(parsed.uptime).toBeDefined();
            expect(typeof parsed.uptime).toBe('number');
            expect(parsed.uptime).toBeGreaterThanOrEqual(0);
        });

        it('should include timestamp field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result.text);

            expect(parsed.timestamp).toBeDefined();
            expect(typeof parsed.timestamp).toBe('string');
            expect(() => new Date(parsed.timestamp)).not.toThrow();
        });
    });

    describe('getDocumentation', () => {
        it('should return auth documentation', async () => {
            const result = await service.getDocumentation({ section: 'auth' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('docs://api/auth');
            expect(result.mimeType).toBe('text/markdown');
            expect(result.text).toContain('# Authentication');
            expect(result.text).toContain('POST /v1/auth/login');
            expect(result.text).toContain('email');
            expect(result.text).toContain('password');
            expect(result.text).toContain('accessToken');
            expect(result.text).toContain('refreshToken');
        });

        it('should return user documentation', async () => {
            const result = await service.getDocumentation({ section: 'user' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('docs://api/user');
            expect(result.mimeType).toBe('text/markdown');
            expect(result.text).toContain('# User Management');
            expect(result.text).toContain('GET /v1/user/profile');
            expect(result.text).toContain('Authorization: Bearer');
            expect(result.text).toContain('firstName');
            expect(result.text).toContain('lastName');
        });

        it('should return post documentation', async () => {
            const result = await service.getDocumentation({ section: 'post' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('docs://api/post');
            expect(result.mimeType).toBe('text/markdown');
            expect(result.text).toContain('# Post Management');
            expect(result.text).toContain('GET /v1/post');
            expect(result.text).toContain('page');
            expect(result.text).toContain('limit');
            expect(result.text).toContain('meta');
        });

        it('should return unknown section message for invalid section', async () => {
            const result = await service.getDocumentation({
                section: 'invalid',
            });

            expect(result).toBeDefined();
            expect(result.uri).toBe('docs://api/invalid');
            expect(result.mimeType).toBe('text/markdown');
            expect(result.text).toContain('# Unknown Section');
            expect(result.text).toContain("Section 'invalid' not found");
        });

        it('should handle empty section name', async () => {
            const result = await service.getDocumentation({ section: '' });

            expect(result).toBeDefined();
            expect(result.text).toContain('# Unknown Section');
        });
    });

    describe('getConfig', () => {
        it('should return nodeVersion config', async () => {
            const result = await service.getConfig({ key: 'nodeVersion' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('config://nodeVersion');
            expect(result.mimeType).toBe('text/plain');
            expect(result.text).toBe(process.version);
        });

        it('should return platform config', async () => {
            const result = await service.getConfig({ key: 'platform' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('config://platform');
            expect(result.mimeType).toBe('text/plain');
            expect(result.text).toBe(process.platform);
        });

        it('should return environment config', async () => {
            const result = await service.getConfig({ key: 'environment' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('config://environment');
            expect(result.mimeType).toBe('text/plain');
            expect(result.text).toBeDefined();
        });

        it('should return port config', async () => {
            const result = await service.getConfig({ key: 'port' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('config://port');
            expect(result.mimeType).toBe('text/plain');
            expect(result.text).toBeDefined();
        });

        it('should return error message for non-allowed config', async () => {
            const result = await service.getConfig({ key: 'secretKey' });

            expect(result).toBeDefined();
            expect(result.uri).toBe('config://secretKey');
            expect(result.mimeType).toBe('text/plain');
            expect(result.text).toBe('Config not found or not allowed');
        });

        it('should handle empty config key', async () => {
            const result = await service.getConfig({ key: '' });

            expect(result).toBeDefined();
            expect(result.text).toBe('Config not found or not allowed');
        });

        it('should handle undefined config key', async () => {
            const result = await service.getConfig({ key: 'nonExistentKey' });

            expect(result).toBeDefined();
            expect(result.text).toBe('Config not found or not allowed');
        });
    });
});
