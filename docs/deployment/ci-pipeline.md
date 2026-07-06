# Continuous Integration Pipeline

## Overview

SpecPilot follows a CI/CD strategy that separates Continuous Integration (CI) from Continuous Deployment (CD).

Continuous Integration is performed through GitHub Actions and is responsible for validating every code change before it is merged into protected branches.

Continuous Deployment is handled independently by Jenkins and is documented separately.

This separation allows automated quality validation while keeping production deployments controlled and reproducible.

---

# CI Architecture

```text
Developer
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions
      │
 ┌────┴─────┐
 │          │
 ▼          ▼

Backend   Frontend

Validation Validation

      │
      ▼

Quality Gate

      │
      ▼

Merge
```

---

## CI Provider

The Continuous Integration pipeline is implemented using GitHub Actions.

Workflow file:

```text
.github/workflows/ci.yml
```

GitHub Actions serves as the automated quality gate for every proposed code change.

Production deployments are intentionally excluded from GitHub Actions and are performed through Jenkins.

---

## Trigger Strategy

The CI pipeline executes automatically on:

- Pushes to `develop`
- Pushes to `main`
- Pull requests targeting `develop`
- Pull requests targeting `main`

This ensures every proposed change is validated before entering protected branches.

---

## Backend Validation

The backend workflow performs the following validation steps:

- Install dependencies
- Generate Prisma Client
- Execute unit tests
- Execute end-to-end tests
- Validate production build

Current commands:

```text
npm ci
npx prisma generate
npm run test
npm run test:e2e
npm run build
```

These checks ensure the NestJS backend remains functional, testable and deployable.

---

## Frontend Validation

The frontend workflow performs:

- Install dependencies
- Execute Angular tests
- Validate production build

Current commands:

```text
npm ci
npm run test -- --watch=false --browsers=ChromeHeadless
npm run build
```

These checks ensure the Angular frontend can be successfully built for production.

---

## Quality Gates

Every workflow execution must complete successfully before a change is considered valid.

Current quality gates include:

- Backend unit tests
- Backend end-to-end tests
- Backend production build
- Frontend automated tests
- Frontend production build

Any failure immediately marks the workflow as failed.

---

## Failure Behaviour

The pipeline stops immediately whenever a validation step fails.

Typical failure scenarios include:

- Unit test failures
- End-to-end test failures
- Frontend test failures
- TypeScript compilation errors
- Build failures
- Missing dependencies
- Prisma generation failures

A failed workflow indicates that the proposed change does not satisfy the repository quality requirements.

---

## Secrets Strategy

The CI workflow intentionally avoids production credentials.

Validation uses mocked services and non-production configuration values.

The workflow never requires:

- Production OpenAI credentials
- Production PostgreSQL credentials
- Production Keycloak credentials
- Production VPS access
- Production deployment permissions

This allows every workflow execution to remain deterministic and infrastructure independent.

---

## Infrastructure Independence

Continuous Integration is intentionally isolated from production infrastructure.

The workflow does not depend on:

- Production VPS availability
- Production PostgreSQL
- Production Keycloak
- Production Docker containers
- External paid AI services

This guarantees reproducible validation regardless of the production environment state.

---

## Relationship with Continuous Deployment

Continuous Integration validates every code change.

Continuous Deployment is handled separately through Jenkins.

Once a change has been merged, Jenkins is responsible for:

- Building production Docker images
- Optional production deployment
- Docker Compose orchestration
- Prisma database migrations
- Health check validation

Separating CI from CD reduces deployment risk while keeping production releases fully controlled.

---

## CI Workflow Summary

```text
Developer Push / Pull Request
                │
                ▼
         GitHub Actions
                │
      ┌─────────┴─────────┐
      │                   │
      ▼                   ▼

 Backend Validation   Frontend Validation

      │                   │
      ▼                   ▼

 Unit Tests         Frontend Tests
 E2E Tests
 Build Validation   Build Validation

      │                   │
      └─────────┬─────────┘
                ▼

          Quality Gate

                │
        ┌───────┴───────┐
        │               │

        ▼               ▼

      PASS            FAIL

        │               │

        ▼               ▼

     Mergeable      Merge Blocked
```

---

## Current Benefits

The current CI pipeline provides:

- Automated validation
- Early failure detection
- Reproducible builds
- Test enforcement
- Build verification
- Merge protection
- Infrastructure-independent validation
- Clear separation between CI and CD

---

## Future Improvements

Potential future enhancements include:

- Docker image build validation
- Dependency vulnerability scanning
- Static code analysis
- Test coverage reporting
- Security scanning
- Automated quality metrics
- Pull request quality reports

These improvements can be incorporated without affecting the deployment workflow, thanks to the separation between Continuous Integration and Continuous Deployment.
