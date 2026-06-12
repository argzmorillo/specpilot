# Environment Configuration

## Overview

SpecPilot AI is designed to support multiple environments without requiring code changes.

Environment-specific values such as API URLs, database credentials, OpenAI keys and Keycloak configuration must be externalized through environment variables.

The goal is to keep the same application code deployable across:

- Local development
- Private beta deployment
- Future production environments

---

# Backend Configuration

The NestJS backend reads configuration through environment variables.

## Required Backend Variables

| Variable             | Description                          | Local Example                                                           | Production Example                              |
| -------------------- | ------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------- |
| NODE_ENV             | Runtime environment                  | development                                                             | production                                      |
| PORT                 | Backend HTTP port                    | 3000                                                                    | 3000                                            |
| DATABASE_URL         | PostgreSQL connection string         | postgresql://specpilot:specpilot@localhost:5432/specpilot?schema=public | Managed by deployment environment               |
| OPENAI_API_KEY       | OpenAI API key                       | your-openai-api-key                                                     | Secret value                                    |
| OPENAI_MODEL         | OpenAI model used by the application | gpt-4.1-mini                                                            | gpt-4.1-mini                                    |
| KEYCLOAK_ISSUER_URL  | Keycloak realm issuer URL            | http://localhost:8080/realms/specpilot                                  | https://auth.adrianmorillo.com/realms/specpilot |
| KEYCLOAK_CLIENT_ID   | API client used for JWT validation   | specpilot-api                                                           | specpilot-api                                   |
| CORS_ALLOWED_ORIGINS | Allowed frontend origins             | http://localhost:4200                                                   | https://specpilot.adrianmorillo.com             |

---

# Frontend Configuration

The Angular frontend requires environment-specific values for API communication and OIDC authentication.

## Required Frontend Variables

| Variable           | Description          | Local Example         | Production Example                      |
| ------------------ | -------------------- | --------------------- | --------------------------------------- |
| API_URL            | Backend API URL      | http://localhost:3000 | https://specpilot-api.adrianmorillo.com |
| KEYCLOAK_URL       | Keycloak base URL    | http://localhost:8080 | https://auth.adrianmorillo.com          |
| KEYCLOAK_REALM     | Keycloak realm       | specpilot             | specpilot                               |
| KEYCLOAK_CLIENT_ID | Frontend OIDC client | specpilot-frontend    | specpilot-frontend                      |

---

# Production Configuration Principles

Production configuration must follow these rules:

- No secrets committed to Git
- No hardcoded production URLs inside application logic
- Environment-specific values must be configurable
- Backend secrets must be stored only in the deployment environment
- Frontend public configuration may contain public URLs and OIDC client identifiers
- OpenAI keys and database credentials must never be exposed to the frontend

---

# Local Development

Current local environment:

```text
Frontend: http://localhost:4200
Backend: http://localhost:3000
Keycloak: http://localhost:8080
PostgreSQL: localhost:5432
```

---

# Private Beta Environment

Target private beta environment:

```text
Frontend: https://specpilot.adrianmorillo.com
Backend: https://specpilot-api.adrianmorillo.com
Keycloak: https://auth.adrianmorillo.com
PostgreSQL: Internal Docker Network
Jenkins: https://ci.adrianmorillo.com
```

---

# Secrets Management

The following values are considered secrets:

- DATABASE_URL
- OPENAI_API_KEY
- Keycloak administrator credentials
- PostgreSQL credentials
- Jenkins credentials

Secrets must never be committed to Git repositories.

Production secrets will be managed through:

- VPS environment variables
- Docker Compose configuration
- Jenkins credentials management

---

# Configuration Validation

The backend should fail fast when required production variables are missing.

Frontend builds should clearly define which backend and authentication services they target.

The same application code should be deployable across environments without requiring source code modifications.
