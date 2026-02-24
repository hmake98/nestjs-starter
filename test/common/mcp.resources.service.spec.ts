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
        it('should return API overview content', async () => {
            const result = await service.getApiOverview();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it('should include NestJS Starter API title', async () => {
            const result = await service.getApiOverview();

            expect(result).toContain('# NestJS Starter API');
        });

        it('should include features section', async () => {
            const result = await service.getApiOverview();

            expect(result).toContain('## Features');
            expect(result).toContain('Authentication & Authorization (JWT)');
            expect(result).toContain(
                'Database Integration (PostgreSQL + Prisma)'
            );
            expect(result).toContain('Email Service (AWS SES)');
            expect(result).toContain('File Upload (AWS S3)');
            expect(result).toContain('Background Jobs (Bull + Redis)');
            expect(result).toContain('API Documentation (Swagger)');
            expect(result).toContain('Logging (Pino)');
            expect(result).toContain('Rate Limiting');
            expect(result).toContain('Health Checks');
        });

        it('should include endpoints section', async () => {
            const result = await service.getApiOverview();

            expect(result).toContain('## Endpoints');
            expect(result).toContain('/v1/auth/*');
            expect(result).toContain('/v1/user/*');
            expect(result).toContain('/v1/post/*');
            expect(result).toContain('/health');
            expect(result).toContain('/docs');
        });
    });

    describe('getServerStatus', () => {
        it('should return server status as JSON string', async () => {
            const result = await service.getServerStatus();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it('should return valid JSON', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result);

            expect(parsed).toBeDefined();
            expect(typeof parsed).toBe('object');
        });

        it('should include status field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result);

            expect(parsed.status).toBe('running');
        });

        it('should include environment field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result);

            expect(parsed.environment).toBeDefined();
            expect(typeof parsed.environment).toBe('string');
        });

        it('should include nodeVersion field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result);

            expect(parsed.nodeVersion).toBe(process.version);
        });

        it('should include platform field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result);

            expect(parsed.platform).toBe(process.platform);
        });

        it('should include uptime field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result);

            expect(parsed.uptime).toBeDefined();
            expect(typeof parsed.uptime).toBe('number');
            expect(parsed.uptime).toBeGreaterThanOrEqual(0);
        });

        it('should include timestamp field', async () => {
            const result = await service.getServerStatus();
            const parsed = JSON.parse(result);

            expect(parsed.timestamp).toBeDefined();
            expect(typeof parsed.timestamp).toBe('string');
            expect(() => new Date(parsed.timestamp)).not.toThrow();
        });
    });

    describe('getAuthDocs', () => {
        it('should return auth documentation', async () => {
            const result = await service.getAuthDocs();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toContain('# Authentication');
            expect(result).toContain('POST /v1/auth/login');
            expect(result).toContain('email');
            expect(result).toContain('password');
            expect(result).toContain('accessToken');
            expect(result).toContain('refreshToken');
        });
    });

    describe('getUserDocs', () => {
        it('should return user documentation', async () => {
            const result = await service.getUserDocs();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toContain('# User Management');
            expect(result).toContain('GET /v1/user/profile');
            expect(result).toContain('Authorization: Bearer');
            expect(result).toContain('firstName');
            expect(result).toContain('lastName');
        });
    });

    describe('getPostDocs', () => {
        it('should return post documentation', async () => {
            const result = await service.getPostDocs();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toContain('# Post Management');
            expect(result).toContain('GET /v1/post');
            expect(result).toContain('page');
            expect(result).toContain('limit');
            expect(result).toContain('meta');
        });
    });

    describe('getNodeVersion', () => {
        it('should return current Node.js version', async () => {
            const result = await service.getNodeVersion();

            expect(result).toBeDefined();
            expect(result).toBe(process.version);
        });
    });

    describe('getPlatform', () => {
        it('should return current platform', async () => {
            const result = await service.getPlatform();

            expect(result).toBeDefined();
            expect(result).toBe(process.platform);
        });
    });

    describe('getEnvironment', () => {
        it('should return current environment', async () => {
            const result = await service.getEnvironment();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });

    describe('getPort', () => {
        it('should return HTTP port', async () => {
            const result = await service.getPort();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });
});
