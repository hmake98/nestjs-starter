import { Injectable } from '@nestjs/common';
import { MCPResource, MCPResourceTemplate } from '@hmake98/nestjs-mcp';

@Injectable()
export class MCPResourcesService {
    /**
     * Static resource - API documentation
     */
    @MCPResource({
        uri: 'docs://api/overview',
        name: 'API Overview',
        description: 'Overview of the NestJS Starter API',
        mimeType: 'text/markdown',
    })
    async getApiOverview() {
        return {
            uri: 'docs://api/overview',
            mimeType: 'text/markdown',
            text: `# NestJS Starter API

This is a production-ready NestJS boilerplate with comprehensive features:

## Features
- Authentication & Authorization (JWT)
- Database Integration (PostgreSQL + Prisma)
- Email Service (AWS SES)
- File Upload (AWS S3)
- Background Jobs (Bull + Redis)
- API Documentation (Swagger)
- Logging (Pino)
- Rate Limiting
- Health Checks

## Endpoints
- \`/v1/auth/*\` - Authentication endpoints
- \`/v1/user/*\` - User management
- \`/v1/post/*\` - Post management
- \`/health\` - Health check endpoint
- \`/docs\` - API documentation`,
        };
    }

    /**
     * Static resource - Server status
     */
    @MCPResource({
        uri: 'status://server',
        name: 'Server Status',
        description: 'Current server status and configuration',
        mimeType: 'application/json',
    })
    async getServerStatus() {
        return {
            uri: 'status://server',
            mimeType: 'application/json',
            text: JSON.stringify(
                {
                    status: 'running',
                    environment: process.env.APP_ENV || 'development',
                    nodeVersion: process.version,
                    platform: process.platform,
                    uptime: process.uptime(),
                    timestamp: new Date().toISOString(),
                },
                null,
                2
            ),
        };
    }

    /**
     * Dynamic resource template - Documentation by section
     */
    @MCPResourceTemplate({
        uriTemplate: 'docs://api/{section}',
        name: 'API Documentation',
        description: 'Access API documentation by section (auth, user, post)',
        mimeType: 'text/markdown',
    })
    async getDocumentation(variables: { section: string }) {
        const docs: Record<string, string> = {
            auth: `# Authentication

## POST /v1/auth/login
Login with email and password

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "accessToken": "...",
  "refreshToken": "..."
}
\`\`\``,

            user: `# User Management

## GET /v1/user/profile
Get current user profile (requires authentication)

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Response:**
\`\`\`json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
\`\`\``,

            post: `# Post Management

## GET /v1/post
List all posts

**Query Parameters:**
- page (number): Page number
- limit (number): Items per page

**Response:**
\`\`\`json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
\`\`\``,
        };

        const content =
            docs[variables.section] ||
            `# Unknown Section\n\nSection '${variables.section}' not found.`;

        return {
            uri: `docs://api/${variables.section}`,
            mimeType: 'text/markdown',
            text: content,
        };
    }

    /**
     * Dynamic resource template - Environment info
     */
    @MCPResourceTemplate({
        uriTemplate: 'config://{key}',
        name: 'Configuration',
        description: 'Access configuration values by key (non-sensitive only)',
        mimeType: 'text/plain',
    })
    async getConfig(variables: { key: string }) {
        const allowedConfigs: Record<string, string> = {
            nodeVersion: process.version,
            platform: process.platform,
            environment: process.env.APP_ENV || 'development',
            port: process.env.HTTP_PORT || '3001',
        };

        const value =
            allowedConfigs[variables.key] || 'Config not found or not allowed';

        return {
            uri: `config://${variables.key}`,
            mimeType: 'text/plain',
            text: value,
        };
    }
}
