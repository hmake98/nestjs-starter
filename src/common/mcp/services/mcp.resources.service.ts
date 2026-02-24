import { Injectable } from '@nestjs/common';
import { Resource } from '@hmake98/nest-mcp';

@Injectable()
export class MCPResourcesService {
    /**
     * Static resource - API documentation overview
     */
    @Resource({
        uri: 'docs://api/overview',
        name: 'API Overview',
        description: 'Overview of the NestJS Starter API',
        mimeType: 'text/markdown',
    })
    async getApiOverview(): Promise<string> {
        return `# NestJS Starter API

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
- \`/docs\` - API documentation`;
    }

    /**
     * Static resource - Server status
     */
    @Resource({
        uri: 'status://server',
        name: 'Server Status',
        description: 'Current server status and configuration',
        mimeType: 'application/json',
    })
    async getServerStatus(): Promise<string> {
        return JSON.stringify(
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
        );
    }

    /**
     * Static resource - Authentication documentation
     */
    @Resource({
        uri: 'docs://api/auth',
        name: 'Auth Documentation',
        description: 'Authentication API documentation',
        mimeType: 'text/markdown',
    })
    async getAuthDocs(): Promise<string> {
        return `# Authentication

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
\`\`\``;
    }

    /**
     * Static resource - User management documentation
     */
    @Resource({
        uri: 'docs://api/user',
        name: 'User Documentation',
        description: 'User management API documentation',
        mimeType: 'text/markdown',
    })
    async getUserDocs(): Promise<string> {
        return `# User Management

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
\`\`\``;
    }

    /**
     * Static resource - Post management documentation
     */
    @Resource({
        uri: 'docs://api/post',
        name: 'Post Documentation',
        description: 'Post management API documentation',
        mimeType: 'text/markdown',
    })
    async getPostDocs(): Promise<string> {
        return `# Post Management

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
\`\`\``;
    }

    /**
     * Static resource - Node.js version config
     */
    @Resource({
        uri: 'config://nodeVersion',
        name: 'Node Version',
        description: 'Current Node.js version',
        mimeType: 'text/plain',
    })
    async getNodeVersion(): Promise<string> {
        return process.version;
    }

    /**
     * Static resource - Platform config
     */
    @Resource({
        uri: 'config://platform',
        name: 'Platform',
        description: 'Current platform',
        mimeType: 'text/plain',
    })
    async getPlatform(): Promise<string> {
        return process.platform;
    }

    /**
     * Static resource - Environment config
     */
    @Resource({
        uri: 'config://environment',
        name: 'Environment',
        description: 'Current application environment',
        mimeType: 'text/plain',
    })
    async getEnvironment(): Promise<string> {
        return process.env.APP_ENV || 'development';
    }

    /**
     * Static resource - Port config
     */
    @Resource({
        uri: 'config://port',
        name: 'Port',
        description: 'HTTP server port',
        mimeType: 'text/plain',
    })
    async getPort(): Promise<string> {
        return process.env.HTTP_PORT || '3001';
    }
}
