# SpecPilot AI

SpecPilot AI is an AI-assisted software specification analysis platform designed to transform functional briefings, requirements and product documentation into structured technical outputs for development teams.

The platform generates:

- Technical summaries
- User stories
- Technical implementation tasks
- Risks and ambiguities
- Open questions for requirement clarification

SpecPilot AI is the first application of a broader portfolio ecosystem featuring shared authentication, centralized access management, microservice-based applications and cloud deployment.

---

## Current Architecture

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
- Shared authentication architecture

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

---

## Testing Strategy

SpecPilot separates automated CI testing from real OpenAI integration testing.

### Automated CI Tests

- Unit and e2e tests use mocked AI responses.
- GitHub Actions does not require `OPENAI_API_KEY`.
- CI pipelines never perform paid OpenAI API requests.

### Manual OpenAI Smoke Testing

Real OpenAI integration is tested manually during local development using a valid `.env` configuration and local backend execution.

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

## Current Status

Current stage:

- Functional MVP
- Frontend/backend communication working
- AI analysis flow operational
- CI pipeline configured
- Automated tests enabled
- Persistence architecture operational
- Historical analysis tracking enabled

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

### v0.5 — Deployable Private Demo

- Cloud deployment
- Production-ready environment setup
- Private access management

### v1.0 — Portfolio Ecosystem Demo

- Shared auth ecosystem
- Multiple interconnected apps
- Centralized access control
- Full portfolio integration

```

```
