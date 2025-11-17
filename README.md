# NestJS Starter Boilerplate 🚀

[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
![Statements](https://img.shields.io/badge/statements-7.94%25-red.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-62.06%25-red.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-38.88%25-red.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-7.94%25-red.svg?style=flat)


A production-ready NestJS boilerplate with comprehensive features and best practices for building scalable APIs.

## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth with access/refresh tokens
- 📚 **API Documentation** - Auto-generated Swagger/OpenAPI documentation
- 🗄️ **Database Integration** - PostgreSQL with Prisma ORM
- 📧 **Email Service** - AWS SES integration with templating
- 📁 **File Upload** - AWS S3 integration with pre-signed URLs
- 🔄 **Background Jobs** - Bull queue with Redis for async processing
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

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with Bull
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3
- **Email**: AWS SES
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with SWC
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes

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
# Build production image
docker build -f ci/Dockerfile.prod -t nestjs-starter:latest .

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

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run tests in watch mode
yarn test --watch

# Debug tests
yarn test:debug
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

### Kubernetes (Recommended)

```bash
# Local deployment with Minikube
minikube start

# Update the Docker image in k8s/deployment.yaml
# image: your-registry/nestjs-starter:latest

# Deploy to Kubernetes
cd k8s
chmod +x deploy.sh
./deploy.sh

# Access the application
kubectl port-forward service/nestjs-starter-service 3001:80 -n nestjs-starter

# Check deployment status
kubectl get pods -n nestjs-starter

# View application logs
kubectl logs -f deployment/nestjs-app -n nestjs-starter

# Clean up (when needed)
kubectl delete namespace nestjs-starter
```

### Docker Production

```bash
# Build and tag production image
docker build -f ci/Dockerfile.prod -t your-registry/nestjs-starter:v1.0.0 .

# Push to registry
docker push your-registry/nestjs-starter:v1.0.0

# Run with Docker
docker run -p 3001:3001 --env-file .env your-registry/nestjs-starter:v1.0.0

# Or deploy with Docker Compose
docker-compose up -d --build
```

### Cloud Deployment

#### AWS ECS/EKS
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag nestjs-starter:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nestjs-starter:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nestjs-starter:latest
```

#### Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/nestjs-starter
gcloud run deploy --image gcr.io/PROJECT-ID/nestjs-starter --platform managed
```

#### Azure Container Instances
```bash
# Push to ACR
az acr build --registry myregistry --image nestjs-starter .
az container create --resource-group myResourceGroup --name nestjs-starter --image myregistry.azurecr.io/nestjs-starter
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **JWT Secrets**: Use strong, randomly generated secrets
3. **Database**: Use connection pooling and read replicas
4. **Rate Limiting**: Configure appropriate limits for your use case
5. **CORS**: Restrict origins to your frontend domains
6. **HTTPS**: Always use TLS in production
7. **Validation**: Input validation on all endpoints
8. **Monitoring**: Set up error tracking and logging

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
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)

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
