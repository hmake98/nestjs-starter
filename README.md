# NestJS Starter Boilerplate 🚀

<div align="center">

[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
[![Test](https://github.com/hmake98/nestjs-starter/actions/workflows/test.yml/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/test.yml)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-97.84%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<p align="center">
  A production-ready NestJS boilerplate with comprehensive features and best practices for building scalable, enterprise-grade APIs.
</p>

<p align="center">
  <strong>⚡️ Quick Start</strong> • <strong>🐳 Docker Ready</strong> • <strong>☸️ Kubernetes Ready</strong> • <strong>🤖 AI/MCP Integrated</strong>
</p>

---

### 🎯 What's Included

<table>
<tr>
<td width="50%">

**Core Features**
- ✅ JWT Authentication (Access/Refresh)
- ✅ Role-Based Access Control (RBAC)
- ✅ PostgreSQL + Prisma ORM
- ✅ Redis Cache & Bull Queues
- ✅ AWS S3 File Uploads
- ✅ AWS SES Email Service
- ✅ Swagger API Documentation
- ✅ Health Checks & Monitoring

</td>
<td width="50%">

**Developer Experience**
- ✅ Docker & Docker Compose
- ✅ Kubernetes Manifests (HPA, Ingress)
- ✅ GitHub Actions CI/CD
- ✅ Jest Testing (75%+ Coverage)
- ✅ ESLint + Prettier + Husky
- ✅ Structured Logging (Pino)
- ✅ Model Context Protocol (MCP)
- ✅ i18n Multi-language Support

</td>
</tr>
</table>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-clone-and-install)
  - [Environment Setup](#2-environment-setup)
  - [Database Setup](#3-database-setup)
  - [Start Development Server](#4-start-development-server)
- [Environment Configuration](#-environment-configuration)
- [Docker Setup](#-docker-setup)
- [Kubernetes Deployment](#️-kubernetes-deployment)
- [API Documentation](#-api-documentation)
- [Model Context Protocol (MCP)](#-model-context-protocol-mcp-integration)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Scripts Reference](#-scripts-reference)
- [License](#-license)

---

## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth with access/refresh tokens
- 📚 **API Documentation** - Auto-generated Swagger/OpenAPI documentation
- 🗄️ **Database Integration** - PostgreSQL with Prisma ORM
- 📧 **Email Service** - AWS SES integration with templating
- 📁 **File Upload** - AWS S3 integration with pre-signed URLs
- 🔄 **Background Jobs** - Bull queue with Redis for async processing
- 🤖 **MCP Integration** - Model Context Protocol support for AI tools, resources, and prompts
- 📊 **Logging** - Structured logging with Pino
- 🧪 **Testing** - Comprehensive unit tests with Jest
- 🐳 **Containerization** - Docker and Docker Compose ready
- ☸️ **Kubernetes** - Production deployment configurations
- 🚀 **CI/CD** - GitHub Actions workflows
- 🔍 **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- 📈 **Monitoring** - Sentry integration for error tracking
- 🚦 **Rate Limiting** - Built-in request throttling
- 🌐 **CORS** - Configurable cross-origin resource sharing
- 🔒 **Security** - Helmet, input validation, and sanitization
- 📝 **Internationalization** - Multi-language support
- 🎯 **Health Checks** - Application and database health endpoints

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL with Prisma ORM 6.x
- **Cache/Queue**: Redis with Bull 4.x
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3
- **Email**: AWS SES
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest 30.x with SWC
- **Logging**: Pino (structured JSON logging)
- **Validation**: class-validator & class-transformer
- **MCP Integration**: @hmake98/nestjs-mcp for AI capabilities
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- Yarn >= 1.22.0
- Docker & Docker Compose (for containerized setup)
- PostgreSQL (if running locally)
- Redis (if running locally)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/hmake98/nestjs-starter.git
cd nestjs-starter

# Install dependencies
yarn install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.docker .env

# Edit the environment file with your configuration
nano .env  # or use your preferred editor
```

### 3. Database Setup

```bash
# Generate Prisma client
yarn generate

# Run database migrations
yarn migrate

# (Optional) Seed email templates
yarn seed:email
```

### 4. Start Development Server

```bash
# Development mode with hot reload
yarn dev

# Or using Docker Compose (recommended for full stack)
docker-compose up --build
```

The API will be available at:
- **API**: http://localhost:3001
- **Documentation**: http://localhost:3001/docs
- **MCP Playground**: http://localhost:3001/mcp/playground (for testing AI tools)

## 📋 Environment Configuration

Create a `.env` file based on `.env.docker` template. All environment variables are documented with comments in the template file.

### Application Settings

| Variable            | Description                              | Default       | Required |
| ------------------- | ---------------------------------------- | ------------- | -------- |
| `APP_ENV`           | Environment mode                         | `local`       | Yes      |
| `APP_NAME`          | Application name                         | `nestjs-starter` | No    |
| `APP_DEBUG`         | Enable debug mode                        | `true`        | No       |
| `APP_LOG_LEVEL`     | Logging level                            | `debug`       | No       |
| `APP_CORS_ORIGINS`  | Comma-separated allowed CORS origins     | `*`           | No       |

### HTTP Server Configuration

| Variable                   | Description                   | Default   | Required |
| -------------------------- | ----------------------------- | --------- | -------- |
| `HTTP_HOST`                | Server bind address           | `0.0.0.0` | No       |
| `HTTP_PORT`                | Server port                   | `3001`    | No       |
| `HTTP_VERSIONING_ENABLE`   | Enable API versioning         | `true`    | No       |
| `HTTP_VERSION`             | Default API version           | `1`       | No       |

### Authentication & JWT

| Variable                    | Description                  | Example                                 | Required |
| --------------------------- | ---------------------------- | --------------------------------------- | -------- |
| `AUTH_ACCESS_TOKEN_SECRET`  | JWT access token secret      | Generate with `openssl rand -base64 32` | Yes      |
| `AUTH_REFRESH_TOKEN_SECRET` | JWT refresh token secret     | Generate with `openssl rand -base64 32` | Yes      |
| `AUTH_ACCESS_TOKEN_EXP`     | Access token expiration      | `1d` (1 day)                            | No       |
| `AUTH_REFRESH_TOKEN_EXP`    | Refresh token expiration     | `7d` (7 days)                           | No       |

### Database Configuration

| Variable       | Description                  | Example                                              | Required |
| -------------- | ---------------------------- | ---------------------------------------------------- | -------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?schema=public` | Yes      |

### AWS Configuration

| Variable                      | Description                      | Example       | Required           |
| ----------------------------- | -------------------------------- | ------------- | ------------------ |
| `AWS_ACCESS_KEY`              | AWS IAM access key               | -             | For AWS features   |
| `AWS_SECRET_KEY`              | AWS IAM secret key               | -             | For AWS features   |
| `AWS_S3_REGION`               | S3 bucket region                 | `us-east-1`   | For S3 uploads     |
| `AWS_S3_BUCKET`               | S3 bucket name                   | `my-bucket`   | For S3 uploads     |
| `AWS_S3_PRESIGN_LINK_EXPIRES` | Pre-signed URL expiration (sec)  | `1200`        | No                 |
| `AWS_SES_REGION`              | SES service region               | `us-east-1`   | For email service  |
| `AWS_SES_SOURCE_EMAIL`        | Verified sender email            | `no-reply@example.com` | For email service |

### Redis Configuration

| Variable           | Description           | Default     | Required |
| ------------------ | --------------------- | ----------- | -------- |
| `REDIS_HOST`       | Redis host            | `redis`     | Yes      |
| `REDIS_PORT`       | Redis port            | `6379`      | No       |
| `REDIS_PASSWORD`   | Redis password        | -           | No       |
| `REDIS_ENABLE_TLS` | Enable TLS for Redis  | `false`     | No       |

### Model Context Protocol (MCP)

| Variable              | Description           | Default              | Required |
| --------------------- | --------------------- | -------------------- | -------- |
| `MCP_SERVER_NAME`     | MCP server name       | `nestjs-starter-mcp` | No       |
| `MCP_SERVER_VERSION`  | MCP server version    | `1.0.0`              | No       |
| `MCP_LOG_LEVEL`       | MCP logging level     | `info`               | No       |

### Error Tracking

| Variable      | Description                | Example | Required |
| ------------- | -------------------------- | ------- | -------- |
| `SENTRY_DSN`  | Sentry error tracking DSN  | -       | No       |

### Quick Setup

```bash
# Copy environment template
cp .env.docker .env

# Generate JWT secrets
echo "AUTH_ACCESS_TOKEN_SECRET=$(openssl rand -base64 32)" >> .env
echo "AUTH_REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)" >> .env

# Edit remaining values
nano .env
```

## 🐳 Docker Setup

### Development with Docker Compose

```bash
# Start all services (app, database, redis)
docker-compose up --build

# Start only database and Redis (run app locally)
docker-compose up postgres redis

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build production image (uses ci/Dockerfile for production)
docker build -f ci/Dockerfile -t nestjs-starter:latest .

# Run production container
docker run -p 3001:3001 --env-file .env nestjs-starter:latest
```

## 📚 API Documentation

### Swagger UI

Visit `/docs` endpoint when the server is running for interactive API documentation.

### Authentication

The API uses JWT Bearer token authentication:

```bash
# Login to get tokens
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use access token in requests
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3001/v1/user/profile
```

## 🤖 Model Context Protocol (MCP) Integration

This boilerplate includes built-in support for the Model Context Protocol (MCP), enabling AI-powered features through tools, resources, and prompts.

### What is MCP?

MCP is a standardized protocol for integrating AI capabilities into applications. It allows you to:
- **Tools**: Execute functions through AI (e.g., calculations, data transformations)
- **Resources**: Provide data to AI (e.g., documentation, configuration)
- **Prompts**: Template AI interactions (e.g., code reviews, documentation generation)

### MCP Playground

Access the interactive MCP playground at `http://localhost:3001/mcp/playground` to:
- Test all available tools, resources, and prompts
- View auto-generated schemas
- Execute operations with real-time feedback

### Built-in Examples

The boilerplate includes example MCP implementations in `src/common/mcp/services/`:

#### Tools (Calculator & Utilities)
```typescript
// Mathematical operations
- add(a, b)          // Add two numbers
- subtract(a, b)     // Subtract two numbers
- multiply(a, b)     // Multiply two numbers
- divide(a, b)       // Divide two numbers

// Text utilities
- toUpperCase(text)  // Convert text to uppercase
- toLowerCase(text)  // Convert text to lowercase
- reverse(text)      // Reverse text string
```

#### Resources (Documentation & Data)
```typescript
// System information
- system://info      // Application metadata and version
- system://config    // Configuration overview
- docs://api         // API documentation

// Data resources
- data://users       // User statistics
- data://posts       // Post statistics
```

#### Prompts (AI Templates)
```typescript
// Code assistance prompts
- code-review        // Review code for best practices
- bug-analysis       // Analyze and suggest bug fixes
- documentation      // Generate documentation
- test-generation    // Generate unit tests
```

### Creating Custom MCP Services

#### 1. Create a Tool Service

```typescript
// src/modules/your-module/services/mcp.tools.service.ts
import { Injectable } from '@nestjs/common';
import { MCPTool, MCPToolWithParams } from '@hmake98/nestjs-mcp';

@Injectable()
export class YourMCPToolsService {
    // Simple tool (auto-infers parameters from TypeScript types)
    @MCPTool({
        name: 'customTool',
        description: 'Your custom tool description',
    })
    async customTool(params: { input: string }): Promise<string> {
        // Your business logic here
        return `Processed: ${params.input}`;
    }

    // Tool with explicit parameter definitions
    @MCPToolWithParams({
        name: 'complexTool',
        description: 'A more complex tool with explicit params',
        parameters: [
            {
                name: 'userId',
                type: 'string',
                description: 'The user ID to process',
                required: true,
            },
            {
                name: 'options',
                type: 'object',
                description: 'Additional options',
                required: false,
            },
        ],
    })
    async complexTool(params: { userId: string; options?: any }): Promise<any> {
        // Your complex business logic
        return { success: true, userId: params.userId };
    }
}
```

#### 2. Create a Resource Service

```typescript
// src/modules/your-module/services/mcp.resources.service.ts
import { Injectable } from '@nestjs/common';
import { MCPResource } from '@hmake98/nestjs-mcp';

@Injectable()
export class YourMCPResourcesService {
    @MCPResource({
        uri: 'data://your-resource',
        name: 'Your Resource',
        description: 'Provides access to your data',
        mimeType: 'application/json',
    })
    async getResource() {
        return {
            uri: 'data://your-resource',
            mimeType: 'application/json',
            text: JSON.stringify({
                data: 'your data',
                timestamp: new Date().toISOString()
            }),
        };
    }
}
```

#### 3. Create a Prompt Service

```typescript
// src/modules/your-module/services/mcp.prompts.service.ts
import { Injectable } from '@nestjs/common';
import { MCPPrompt } from '@hmake98/nestjs-mcp';

@Injectable()
export class YourMCPPromptsService {
    @MCPPrompt({
        name: 'customPrompt',
        description: 'Custom AI prompt template',
        arguments: [
            {
                name: 'context',
                description: 'Context for the prompt',
                required: true,
            },
        ],
    })
    async customPrompt(args: { context: string }) {
        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Given the context: ${args.context}, please provide analysis.`,
                    },
                },
            ],
        };
    }
}
```

#### 4. Register in Module

```typescript
// src/modules/your-module/your-module.module.ts
import { Module } from '@nestjs/common';
import { YourMCPToolsService } from './services/mcp.tools.service';
import { YourMCPResourcesService } from './services/mcp.resources.service';
import { YourMCPPromptsService } from './services/mcp.prompts.service';

@Module({
    providers: [
        YourMCPToolsService,
        YourMCPResourcesService,
        YourMCPPromptsService,
    ],
    exports: [
        YourMCPToolsService,
        YourMCPResourcesService,
        YourMCPPromptsService,
    ],
})
export class YourModule {}
```

MCP services are **auto-discovered** - no additional registration needed! Just create the services with decorators and they'll automatically appear in the MCP playground.

### Configuration

MCP settings can be configured via environment variables:

```bash
MCP_SERVER_NAME="your-mcp-server"
MCP_SERVER_VERSION="1.0.0"
MCP_LOG_LEVEL="info"  # debug, info, warn, error
```

### Learn More

- [MCP Package Documentation](https://github.com/hmake98/nestjs-mcp)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

## 🧪 Testing

The project uses Jest with SWC for fast test execution. Tests are located in the `test/` directory, mirroring the `src/` structure.

```bash
# Run all tests
yarn test

# Run tests in watch mode (requires manual setup)
jest --config test/jest.json --watch

# Debug tests
yarn test:debug
```

**Test Structure**:
- `test/common/` - Tests for shared services (auth, database, helpers, AWS)
- `test/modules/` - Tests for feature modules (user, post)
- `test/workers/` - Tests for background processors
- `test/mocks/` - Mock data generators using @faker-js/faker

**Example Test**:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/modules/user/services/user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, /* mock dependencies */],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
```

## 📁 Project Structure

```
src/
├── app/                    # Application module and health checks
├── common/                 # Shared modules and utilities
│   ├── auth/              # Authentication logic
│   ├── aws/               # AWS services (S3, SES)
│   ├── config/            # Configuration files
│   ├── database/          # Database service and connection
│   ├── file/              # File upload handling
│   ├── helper/            # Utility services
│   ├── logger/            # Logging configuration
│   ├── mcp/               # Model Context Protocol integration
│   │   └── services/      # MCP tools, resources, and prompts
│   ├── message/           # Internationalization
│   ├── request/           # Request decorators and guards
│   └── response/          # Response interceptors and filters
├── languages/             # Translation files
├── migrations/            # Database seeders and migrations
├── modules/               # Feature modules
│   ├── post/              # Post management
│   └── user/              # User management
└── workers/               # Background job processors
```

## 🔧 Development Workflow

### Code Quality

```bash
# Lint code
yarn lint

# Format code
yarn format

# Type checking
yarn build
```

### Database Operations

```bash
# Generate Prisma client after schema changes
yarn generate

# Create new migration
yarn migrate

# Deploy migrations to production
yarn migrate:prod

# Open Prisma Studio
yarn studio
```

### Background Jobs

```bash
# Seed email templates
yarn seed:email

# Remove email templates
yarn rollback:email
```

## ☸️ Kubernetes Deployment

The project includes complete Kubernetes manifests in the `k8s/` directory for production deployment.

### Available Kubernetes Resources

```
k8s/
├── namespace.yaml              # Namespace isolation
├── configmap.yaml             # Non-sensitive configuration
├── secret.yaml                # Sensitive data (base64 encoded)
├── postgres-pvc.yaml          # PostgreSQL persistent storage
├── postgres-deployment.yaml   # PostgreSQL database
├── postgres-service.yaml      # PostgreSQL service
├── redis-pvc.yaml            # Redis persistent storage
├── redis-deployment.yaml     # Redis cache/queue
├── redis-service.yaml        # Redis service
├── app-deployment.yaml       # NestJS application
├── app-service.yaml          # Application service
├── ingress.yaml              # Ingress controller config
└── hpa.yaml                  # Horizontal Pod Autoscaler
```

### Deploy to Kubernetes

#### 1. Configure Secrets

```bash
# Create namespace first
kubectl apply -f k8s/namespace.yaml

# Update k8s/secret.yaml with your base64-encoded secrets
# Generate base64 values:
echo -n "your-secret-value" | base64

# Or use this helper to create secrets directly:
kubectl create secret generic nestjs-secrets \
  --from-literal=database-url='postgresql://user:pass@postgres:5432/db' \
  --from-literal=jwt-access-secret='your-access-secret' \
  --from-literal=jwt-refresh-secret='your-refresh-secret' \
  --from-literal=aws-access-key='your-aws-key' \
  --from-literal=aws-secret-key='your-aws-secret' \
  -n nestjs-starter
```

#### 2. Update ConfigMap

```bash
# Edit k8s/configmap.yaml with your configuration
# Then apply:
kubectl apply -f k8s/configmap.yaml
```

#### 3. Deploy Infrastructure (Database & Redis)

```bash
# Deploy PostgreSQL
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

# Deploy Redis
kubectl apply -f k8s/redis-pvc.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n nestjs-starter --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n nestjs-starter --timeout=300s
```

#### 4. Deploy Application

```bash
# Deploy the NestJS application
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml

# Deploy ingress (configure your domain first)
kubectl apply -f k8s/ingress.yaml

# (Optional) Enable auto-scaling
kubectl apply -f k8s/hpa.yaml
```

#### 5. Verify Deployment

```bash
# Check all resources
kubectl get all -n nestjs-starter

# Check pods
kubectl get pods -n nestjs-starter

# Check logs
kubectl logs -f deployment/nestjs-app -n nestjs-starter

# Check service
kubectl get svc -n nestjs-starter

# Describe pod for troubleshooting
kubectl describe pod <pod-name> -n nestjs-starter
```

#### 6. Run Database Migrations

```bash
# Execute migrations in a running pod
kubectl exec -it deployment/nestjs-app -n nestjs-starter -- yarn migrate:prod

# Or run as a one-off job
kubectl run migration-job \
  --image=your-registry/nestjs-starter:latest \
  --restart=Never \
  --env="DATABASE_URL=..." \
  -n nestjs-starter \
  -- yarn migrate:prod
```

### Accessing the Application

```bash
# Port forward for local testing
kubectl port-forward svc/nestjs-service 3001:3001 -n nestjs-starter

# Or access via ingress (configure DNS first)
# https://your-domain.com
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment/nestjs-app --replicas=5 -n nestjs-starter

# Horizontal Pod Autoscaler (HPA) is configured to scale between 2-10 replicas
# based on CPU utilization (70% threshold)
kubectl get hpa -n nestjs-starter
```

### Updating the Application

```bash
# Build and push new image
docker build -f ci/Dockerfile -t your-registry/nestjs-starter:v2.0.0 .
docker push your-registry/nestjs-starter:v2.0.0

# Update deployment
kubectl set image deployment/nestjs-app \
  nestjs-app=your-registry/nestjs-starter:v2.0.0 \
  -n nestjs-starter

# Or use rolling update
kubectl rollout restart deployment/nestjs-app -n nestjs-starter

# Check rollout status
kubectl rollout status deployment/nestjs-app -n nestjs-starter

# Rollback if needed
kubectl rollout undo deployment/nestjs-app -n nestjs-starter
```

### Clean Up

```bash
# Delete all resources
kubectl delete namespace nestjs-starter

# Or delete individual resources
kubectl delete -f k8s/
```

---

## 🚀 Deployment

### Docker Production (Recommended)

```bash
# Build and tag production image
docker build -f ci/Dockerfile -t your-registry/nestjs-starter:v1.0.0 .

# Push to registry
docker push your-registry/nestjs-starter:v1.0.0

# Run with Docker
docker run -d -p 3001:3001 --env-file .env --name nestjs-app your-registry/nestjs-starter:v1.0.0

# Or deploy with Docker Compose (full stack)
docker-compose up -d --build
```

### Cloud Deployment Examples

#### AWS ECS
```bash
# 1. Create ECR repository
aws ecr create-repository --repository-name nestjs-starter --region us-east-1

# 2. Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# 3. Build and push
docker build -f ci/Dockerfile -t nestjs-starter:latest .
docker tag nestjs-starter:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nestjs-starter:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nestjs-starter:latest

# 4. Create ECS task definition and service through AWS Console or CLI
```

#### Google Cloud Run
```bash
# 1. Build and submit to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/nestjs-starter

# 2. Deploy to Cloud Run
gcloud run deploy nestjs-starter \
  --image gcr.io/PROJECT-ID/nestjs-starter \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "APP_ENV=production" \
  --port 3001
```

#### DigitalOcean App Platform
```bash
# 1. Push to Docker Hub or DigitalOcean Container Registry
docker build -f ci/Dockerfile -t your-dockerhub/nestjs-starter:latest .
docker push your-dockerhub/nestjs-starter:latest

# 2. Create app via DigitalOcean Console
#    - Select Docker Hub as source
#    - Configure environment variables
#    - Add PostgreSQL and Redis managed databases
```

#### Heroku
```bash
# 1. Login to Heroku
heroku login
heroku container:login

# 2. Create app
heroku create your-app-name

# 3. Add PostgreSQL and Redis addons
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# 4. Build and push
docker build -f ci/Dockerfile -t registry.heroku.com/your-app-name/web .
docker push registry.heroku.com/your-app-name/web

# 5. Release
heroku container:release web -a your-app-name
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit sensitive data - use `.env.docker` as template only
2. **JWT Secrets**: Use strong, randomly generated secrets (minimum 32 characters)
   ```bash
   openssl rand -base64 32
   ```
3. **Global Guards**: All routes are protected by default (JWT, Roles, Throttler)
4. **Password Hashing**: Uses Argon2 for secure password storage
5. **Rate Limiting**: Throttler guard prevents brute force attacks
6. **CORS**: Configure `APP_CORS_ORIGINS` to restrict allowed domains
7. **Helmet**: Security headers configured automatically
8. **Input Validation**: class-validator validates all DTOs automatically
9. **Database**: Use connection pooling, read replicas, and prepared statements (Prisma handles this)
10. **HTTPS**: Always use TLS in production
11. **Monitoring**: Sentry integration for error tracking and monitoring
12. **Soft Deletes**: Models support soft deletion to prevent data loss

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

**Problem**: `Error: Can't reach database server`

```bash
# Check if PostgreSQL is running
docker-compose ps postgres
# or
kubectl get pods -n nestjs-starter | grep postgres

# Check DATABASE_URL format
# Correct: postgresql://username:password@host:5432/database?schema=public

# For Docker: use service name as host
DATABASE_URL="postgresql://postgres:password@postgres:5432/db"

# For local: use localhost
DATABASE_URL="postgresql://postgres:password@localhost:5432/db"

# For Kubernetes: use service name
DATABASE_URL="postgresql://postgres:password@postgres.nestjs-starter.svc.cluster.local:5432/db"
```

#### Redis Connection Issues

**Problem**: `Error: Redis connection refused`

```bash
# Check if Redis is running
docker-compose ps redis
# or
kubectl get pods -n nestjs-starter | grep redis

# Verify REDIS_HOST matches your setup
# Docker: REDIS_HOST=redis
# Local: REDIS_HOST=localhost
# K8s: REDIS_HOST=redis.nestjs-starter.svc.cluster.local
```

#### Prisma Migration Errors

**Problem**: `Migration failed` or `Schema is out of sync`

```bash
# Reset database (⚠️ DESTRUCTIVE - development only)
docker-compose down -v
docker-compose up -d postgres redis
yarn generate
yarn migrate

# For production, run migrations explicitly
yarn migrate:prod

# If stuck, check migration status
npx prisma migrate status
```

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3001`

```bash
# Find process using the port (macOS/Linux)
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port
HTTP_PORT=3002 yarn dev
```

#### Docker Build Fails

**Problem**: `ERROR [builder X/Y] RUN yarn install --frozen-lockfile`

```bash
# Clear Docker build cache
docker builder prune -af

# Rebuild without cache
docker-compose build --no-cache

# Check Docker resources (ensure enough memory/disk)
docker system df
docker system prune
```

#### JWT Token Issues

**Problem**: `Unauthorized` or `Invalid token`

```bash
# Ensure secrets are properly set
echo $AUTH_ACCESS_TOKEN_SECRET
echo $AUTH_REFRESH_TOKEN_SECRET

# Secrets must be the same across restarts
# Use strong random values (min 32 characters)
openssl rand -base64 32

# Check token expiration settings
AUTH_ACCESS_TOKEN_EXP=1d   # 1 day
AUTH_REFRESH_TOKEN_EXP=7d  # 7 days
```

#### AWS S3/SES Integration Issues

**Problem**: `AccessDenied` or `InvalidAccessKeyId`

```bash
# Verify AWS credentials
aws configure list
aws sts get-caller-identity

# Check IAM permissions for S3
# Required: s3:PutObject, s3:GetObject, s3:DeleteObject

# Check IAM permissions for SES
# Required: ses:SendEmail, ses:SendRawEmail

# Verify email is verified in SES (sandbox mode)
aws ses list-verified-email-addresses

# Check S3 bucket exists and region matches
aws s3 ls s3://your-bucket-name --region us-east-1
```

#### Tests Failing

**Problem**: Tests fail unexpectedly

```bash
# Clear test cache
yarn test --clearCache

# Run tests with verbose output
yarn test --verbose

# Run specific test file
yarn test --testPathPattern=user.service.spec.ts

# Check for missing mocks
# Ensure all external dependencies are properly mocked
```

#### TypeScript Compilation Errors

**Problem**: `error TS2307: Cannot find module`

```bash
# Clear build cache and reinstall
rm -rf dist node_modules yarn.lock
yarn install
yarn build

# Regenerate Prisma client
yarn generate

# Check tsconfig.json paths configuration
```

#### Memory/Performance Issues

**Problem**: Application crashes or runs slowly

```bash
# Check memory usage
docker stats

# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" yarn start

# Enable garbage collection logs
NODE_OPTIONS="--trace-gc" yarn dev

# Check for memory leaks in production
# Use clinic.js or node --inspect
```

#### Kubernetes Pod CrashLoopBackOff

**Problem**: Pod keeps restarting

```bash
# Check pod logs
kubectl logs -f <pod-name> -n nestjs-starter
kubectl logs <pod-name> --previous -n nestjs-starter

# Describe pod for events
kubectl describe pod <pod-name> -n nestjs-starter

# Common causes:
# 1. Missing environment variables
# 2. Database not ready (add init containers)
# 3. Health check failing too quickly (adjust liveness/readiness probes)
# 4. Insufficient resources (increase limits)

# Check events
kubectl get events -n nestjs-starter --sort-by='.lastTimestamp'
```

#### Email Not Sending (SES)

**Problem**: Emails not being sent

```bash
# Check SES sandbox mode
# In sandbox, you can only send to verified emails

# Verify sender email
aws ses verify-email-identity --email-address your-email@domain.com

# Check SES sending quota
aws ses get-send-quota

# Check email queue (Bull)
# Visit Bull Board or check Redis
redis-cli KEYS "bull:email:*"

# Check worker logs
docker-compose logs worker
```

### Getting Help

If you encounter issues not covered here:

1. **Check Logs**: Always start with application logs
   ```bash
   # Docker
   docker-compose logs -f app

   # Kubernetes
   kubectl logs -f deployment/nestjs-app -n nestjs-starter
   ```

2. **Enable Debug Mode**:
   ```bash
   APP_DEBUG=true
   APP_LOG_LEVEL=debug
   ```

3. **Search Issues**: Check [GitHub Issues](https://github.com/hmake98/nestjs-starter/issues)

4. **Create an Issue**: Provide:
   - Error message
   - Steps to reproduce
   - Environment (Node version, OS, Docker/K8s)
   - Relevant logs

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript and ESLint rules
- Write tests for new features
- Update documentation when needed
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 Scripts Reference

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `yarn dev`      | Start development server with hot reload |
| `yarn build`    | Build for production                     |
| `yarn start`    | Start production server                  |
| `yarn test`     | Run unit tests                           |
| `yarn lint`     | Lint and fix code                        |
| `yarn format`   | Format code with Prettier                |
| `yarn generate` | Generate Prisma client                   |
| `yarn migrate`  | Run database migrations                  |
| `yarn studio`   | Open Prisma Studio                       |

## 🔗 Useful Links

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)
- [Bull Queue](https://github.com/OptimalBits/bull)
- [Pino Logger](https://getpino.io/)
- [class-validator](https://github.com/typestack/class-validator)
- [Docker Documentation](https://docs.docker.com)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
- [@hmake98/nestjs-mcp Package](https://www.npmjs.com/package/@hmake98/nestjs-mcp)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Harsh Makwana**

- 🌐 [GitHub](https://github.com/hmake98)
- 💼 [LinkedIn](https://www.linkedin.com/in/hmake98)
- 📷 [Instagram](https://www.instagram.com/hmake98)

## 🙏 Support

If this project helped you, please consider giving it a ⭐️!

---

**Happy Coding! 🎉**
