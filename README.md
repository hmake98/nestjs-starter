# NestJS Starter Boilerplate 🚀

[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
![Statements](https://img.shields.io/badge/statements-75.98%25-red.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-95.65%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-96.55%25-brightgreen.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-75.98%25-red.svg?style=flat)


A production-ready NestJS boilerplate with comprehensive features and best practices for building scalable APIs.

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

Create a `.env` file based on `.env.docker` template:

### Required Variables

| Variable                    | Description                  | Example                                 |
| --------------------------- | ---------------------------- | --------------------------------------- |
| `APP_ENV`                  | Environment mode             | `local`, `development`, `production`    |
| `DATABASE_URL`              | PostgreSQL connection string | `postgresql://user:pass@host:5432/db`   |
| `AUTH_ACCESS_TOKEN_SECRET`  | JWT access token secret      | Generate with `openssl rand -base64 32` |
| `AUTH_REFRESH_TOKEN_SECRET` | JWT refresh token secret     | Generate with `openssl rand -base64 32` |

### Optional Variables

| Variable         | Description               | Default     |
| ---------------- | ------------------------- | ----------- |
| `HTTP_PORT`      | Server port               | `3001`      |
| `REDIS_HOST`     | Redis host                | `localhost` |
| `AWS_ACCESS_KEY` | AWS access key            | -           |
| `AWS_SECRET_KEY` | AWS secret key            | -           |
| `SENTRY_DSN`     | Sentry error tracking DSN | -           |

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
