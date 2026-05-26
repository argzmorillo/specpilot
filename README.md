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

### AI Integration
SpecPilot uses OpenAI models to analyze software specifications and generate structured development-oriented outputs.

The AI layer is isolated inside a dedicated backend service to allow:
- Future provider abstraction
- Prompt specialization
- Safer testing/mocking strategies
- Centralized AI orchestration

---

## Current Features

- Specification analysis
- Structured AI output generation
- Validation handling
- Loading and error states
- Character limit protection
- CI pipeline with automated testing
- Mocked AI testing strategy

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
- Initial responsive layout in progress

---

## Roadmap

### v0.2 — Product Specialization & UX
- Improve specification-focused prompting
- Improve UX/UI structure
- Stabilize testing strategy

### v0.3 — Authentication & Access Design
- Shared authentication architecture
- Access request flow
- Protected applications

### v0.4 — Deployable Private Demo
- Cloud deployment
- Production-ready environment setup
- Private access management

### v1.0 — Portfolio Ecosystem Demo
- Shared auth ecosystem
- Multiple interconnected apps
- Centralized access control
- Full portfolio integration
