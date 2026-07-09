# SpecPilot AI

SpecPilot AI is an AI-assisted software specification analysis platform designed to transform functional briefings, requirements and product documentation into structured technical outputs for development teams.

The platform generates:

- Technical summaries
- User stories
- Technical implementation tasks
- Risks and ambiguities
- Open questions for requirement clarification

SpecPilot AI is the first application of a broader portfolio ecosystem featuring shared authentication, centralized access management, microservice-based applications and cloud deployment.
The platform is currently deployed in a production-like private beta environment featuring Dockerized services, centralized authentication, HTTPS, automated CI/CD pipelines and production-oriented infrastructure.

## Architecture Overview

```text
                Internet
                     │
                     ▼
              NGINX Reverse Proxy
                     │
 ┌─────────────┬──────────────┬──────────────┬──────────────┐
 ▼             ▼              ▼              ▼

Frontend      Backend      Keycloak      Jenkins
                  │
                  ▼
             PostgreSQL
```

---

## Technology Stack

### Frontend

- Angular 20
- Standalone components
- Signals API
- TypeScript
- Responsive UI foundation

### Backend

- NestJS
- REST API architecture
- DTO validation with class-validator
- OpenAI integration layer
- Modular backend structure

### Infrastructure

- Ubuntu Server VPS
- Docker
- Docker Compose
- NGINX Reverse Proxy
- PostgreSQL
- Let's Encrypt

### CI/CD

- GitHub Actions (Continuous Integration)
- Jenkins (Continuous Deployment)

## Authentication Architecture

SpecPilot AI uses a centralized authentication architecture based on Keycloak and OpenID Connect (OIDC).

Key capabilities:

- Centralized authentication
- Single Sign-On (SSO)
- JWT-based API authorization
- Shared identity management
- Ecosystem-ready architecture

For a detailed explanation see:

- [Authentication Architecture](docs/architecture/auth-architecture.md)

## Environment Configuration

SpecPilot supports local and production-like configuration through environment-specific variables.

The application is designed to support multiple deployment environments without requiring source code modifications.

Configuration values such as database connections, API keys, authentication endpoints and allowed origins are externalized through environment variables.

## Production Infrastructure

The current private beta environment is fully deployed on a production VPS using Docker Compose.

Current production services include:

- Angular Frontend
- NestJS Backend
- PostgreSQL
- Keycloak
- Jenkins
- NGINX Reverse Proxy

Public endpoints:

- Frontend → https://specpilot.adrianmorillo.com
- API → https://api.specpilot.adrianmorillo.com
- Authentication → https://auth.adrianmorillo.com
- CI/CD → https://ci.adrianmorillo.com

### Persistence Architecture

SpecPilot AI uses PostgreSQL and Prisma ORM as the persistence foundation for historical analysis tracking and future ecosystem features.

The persistence layer currently stores:

- Original specification input
- AI-generated technical outputs
- Historical analysis records
- Request duration metadata
- AI token usage metadata
- Model/provider metadata

Persistence access is isolated through repository classes to keep business logic decoupled from ORM implementation details.

Current persistence goals:

- Historical analysis retrieval
- Lightweight AI usage tracking
- Future authentication integration
- Extensible domain architecture

### AI Integration

SpecPilot uses OpenAI models to analyze software specifications and generate structured development-oriented outputs.

The AI layer is isolated inside a dedicated backend service to allow:

- Future provider abstraction
- Prompt specialization
- Safer testing/mocking strategies
- Centralized AI orchestration

---

## Local Development & Database

SpecPilot AI uses PostgreSQL + Prisma as the persistence layer foundation for future analysis history, usage tracking and user-related features.

## Persistence Flow

```text
Frontend (Angular)
        ↓
REST API (NestJS)
        ↓
AI Service
        ↓
OpenAI Responses API
        ↓
Structured Analysis Result
        ↓
AnalysisRepository
        ↓
Prisma ORM
        ↓
PostgreSQL
```

The persistence flow is intentionally lightweight during the MVP stage while remaining extensible for future authentication, analytics and multi-application ecosystem integration.

### Local PostgreSQL Setup

Start the local PostgreSQL container using Docker:

```bash
docker compose up -d
```

The database is exposed locally on port `5432`.

---

### Run Prisma Migrations

From the backend folder:

```bash
cd backend
npx prisma migrate dev
```

This command:

- Applies pending migrations
- Synchronizes the local database schema
- Generates the Prisma client automatically

---

### Generate Prisma Client Manually

If needed, the Prisma client can be regenerated manually:

```bash
npx prisma generate
```

---

### Open Prisma Studio

Prisma Studio provides a visual interface for inspecting and editing database records during development.

From the backend folder:

```bash
npm run prisma:studio
```

---

### CI Compatibility

Current CI pipelines do not require a running PostgreSQL instance.

Database integration has been prepared incrementally to keep automated tests isolated and stable during development.

---

## Architecture Documentation

Additional architecture decisions and ecosystem documentation can be found inside the `/docs` directory.

Current documentation:

### Architecture

- [Authentication Architecture](docs/architecture/auth-architecture.md)
- [Environment Configuration](docs/architecture/environment-configuration.md)
- [Deployment Architecture](docs/architecture/deployment-architecture.md)
- [PostgreSQL Persistence](docs/architecture/postgresql-persistence.md)
- [Access Request Domain](docs/architecture/access-request-domain.md)

### Deployment

- [Backend Docker Image](docs/deployment/backend-docker.md)
- [Frontend Docker Image](docs/deployment/frontend-docker.md)
- [Docker Compose Stack](docs/deployment/docker-compose-stack.md)
- [NGINX Reverse Proxy Routing](docs/deployment/reverse-proxy-routing.md)
- [Production HTTPS and DNS](docs/deployment/production-https-and-dns.md)
- [Production Security Configuration](docs/deployment/production-security.md)
- [Jenkins Deployment](docs/deployment/jenkins-deployment.md)

### Operations

- [Health Checks](docs/operations/health-checks.md)
- [CI Pipeline](docs/deployment/ci-pipeline.md)

### Portfolio Ecosystem

- [Ecosystem Vision](docs/portfolio/ecosystem-vision.md)

## Deployment Status

The current private beta environment is fully deployed and operational.

Current production infrastructure:

- Ubuntu VPS
- Docker Compose
- Angular Frontend
- NestJS Backend
- PostgreSQL
- Keycloak
- NGINX Reverse Proxy
- HTTPS
- Jenkins
- JWT Authentication
- Role-Based Access Control (RBAC)
- Production CI/CD Pipeline

## Current Features

- AI-powered specification analysis
- Structured technical artifact generation
- PostgreSQL persistence layer
- Historical analysis retrieval
- Responsive analysis interface
- Lightweight AI usage tracking
- Validation and error handling
- CI pipeline with automated testing
- Mocked OpenAI testing strategy
- Modular backend architecture
- Keycloak authentication
- Role-Based Access Control (RBAC)
- HTTPS infrastructure
- Production deployment pipeline
- Jenkins deployment automation

---

## Testing Strategy

SpecPilot separates automated CI testing from real OpenAI integration testing.

### Automated CI Tests

- Unit and e2e tests use mocked AI responses.
- GitHub Actions does not require `OPENAI_API_KEY`.
- CI pipelines never perform paid OpenAI API requests.

### Manual OpenAI Smoke Testing

Real OpenAI integration is tested manually during local development using a valid `.env` configuration and local backend execution.

### Production Deployment Validation

Production deployments are executed through Jenkins.

The deployment pipeline performs:

- Docker image builds
- Container recreation
- Prisma migrations
- Deployment health checks

This deployment workflow is documented separately under the deployment documentation.

---

## Portfolio Ecosystem Vision

SpecPilot is being developed as part of a larger portfolio ecosystem designed to simulate real-world enterprise architecture patterns.

Planned ecosystem features include:

- Shared authentication service
- Role and access management
- Multiple interconnected applications
- Centralized user management
- CI/CD pipelines
- Cloud deployment
- Microservice communication
- Observability and monitoring

Future applications may use different stacks including:

- Angular
- Vue
- React
- NestJS
- Spring Boot
- Python services

---

## Current Project Status

Current stage:

- Functional MVP
- Frontend/backend communication working
- AI analysis flow operational
- Automated tests enabled
- PostgreSQL persistence operational
- Historical analysis tracking enabled
- Dockerized backend
- Dockerized frontend
- Production VPS deployed
- Docker Compose production stack operational
- Reverse proxy configured
- HTTPS enabled
- Keycloak operational
- Jenkins deployment pipeline operational
- Keycloak authentication integration
- JWT-based API protection

---

## Roadmap

### v0.2 — Product Specialization & UX

- Improve specification-focused prompting
- Improve UX/UI structure
- Stabilize testing strategy

### v0.3 — Persistence & Analysis History

- PostgreSQL integration
- Prisma ORM integration
- Analysis persistence
- Historical analysis retrieval
- Usage tracking foundation

### v0.4 — Authentication & Access Design

- Shared authentication architecture
- Access request flow
- Protected applications

### v0.5 — Private Beta Infrastructure

- Production VPS deployment
- Production-ready environment setup
- Private access management

### v1.0 — Portfolio Ecosystem Demo

- Shared auth ecosystem
- Multiple interconnected apps
- Centralized access control
- Full portfolio integration

```

```
