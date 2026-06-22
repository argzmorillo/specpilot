# Continuous Integration Pipeline

## Overview

SpecPilot uses a Continuous Integration (CI) pipeline to validate application quality before code is merged or deployed.

The pipeline executes automated validation checks on every push and pull request targeting protected branches.

The objective is to detect build failures, test failures and integration issues as early as possible while keeping the deployment process reliable and reproducible.

---

## Pipeline Provider

The current CI pipeline is implemented using GitHub Actions.

Workflow file:

```text
.github/workflows/ci.yml
```

GitHub Actions serves as the automated quality gate for all code changes entering the repository.

---

## Trigger Strategy

The CI pipeline runs automatically on:

- Pushes to `develop`
- Pushes to `main`
- Pull requests targeting `develop`
- Pull requests targeting `main`

This ensures that all proposed changes are validated before being merged into protected branches.

---

## Backend Validation

The backend CI job performs the following checks:

- Install backend dependencies
- Generate Prisma Client
- Execute unit tests
- Execute end-to-end tests
- Validate production build

Current validation commands:

```text
npm ci
npx prisma generate
npm run test
npm run test:e2e
npm run build
```

These checks verify that the NestJS backend remains functional, testable and deployable.

---

## Frontend Validation

The frontend CI job performs the following checks:

- Install frontend dependencies
- Execute frontend tests
- Validate Angular production build

Current validation commands:

```text
npm ci
npm run test -- --watch=false --browsers=ChromeHeadless
npm run build
```

These checks verify that the Angular frontend remains functional and can be compiled successfully for deployment.

---

## Quality Gates

A change is considered valid only if all automated checks complete successfully.

Current quality gates:

- Backend unit tests pass
- Backend e2e tests pass
- Backend build succeeds
- Frontend tests pass
- Frontend build succeeds

Any failure automatically causes the CI pipeline to fail.

This prevents broken code from being merged into protected branches.

---

## Failure Behavior

The CI pipeline is designed to fail immediately when a validation step fails.

Examples:

- Failing backend unit tests
- Failing backend e2e tests
- Failing frontend tests
- TypeScript compilation errors
- Build configuration errors
- Missing dependencies

A failed pipeline indicates that the proposed change does not meet the repository quality requirements.

---

## Secrets Strategy

The CI pipeline does not require production secrets.

Automated tests use mocked dependencies and non-production configuration values.

The pipeline does not require:

- OpenAI production credentials
- Production database credentials
- Keycloak production credentials
- Production infrastructure access
- Production deployment permissions

This allows CI validation to run safely in isolated GitHub-hosted environments.

---

## Infrastructure Independence

The CI pipeline is intentionally designed to run without requiring production infrastructure.

The pipeline does not depend on:

- Production VPS availability
- Production PostgreSQL instances
- Production Keycloak instances
- Production Docker environments
- External paid AI services

This guarantees consistent validation regardless of infrastructure state.

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

 Unit Tests          Frontend Tests
 E2E Tests
 Build Validation    Build Validation

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

The CI pipeline currently provides:

- Automated validation
- Early failure detection
- Reproducible builds
- Test enforcement
- Build verification
- Merge protection support
- Infrastructure-independent validation

---

## Future Improvements

Potential future enhancements include:

- Docker image build validation
- Dependency vulnerability scanning
- Static code analysis
- Test coverage reporting
- Security scanning
- Automated code quality metrics
- Pull request quality reports

These improvements may be introduced as the platform evolves toward a production-ready ecosystem.
