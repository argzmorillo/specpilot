# Docker Compose Production Stack

## Overview

SpecPilot uses a production-oriented Docker Compose stack to orchestrate the complete private beta environment.

The stack defines every service required to operate the platform, including application services, authentication, persistence, reverse proxy and deployment automation.

Current services include:

- Angular Frontend
- NestJS Backend API
- PostgreSQL
- Keycloak
- Jenkins
- NGINX Reverse Proxy

All services are deployed together using a single Docker Compose configuration.

---

# Service Overview

## specpilot-frontend

Angular production build served through NGINX.

Public endpoint:

```text
https://specpilot.adrianmorillo.com
```

Responsibilities:

- User interface
- Authentication initiation
- API communication

---

## specpilot-api

NestJS backend API.

Public endpoint:

```text
https://api.specpilot.adrianmorillo.com
```

Responsibilities:

- Business logic
- OpenAI integration
- Authorization
- Analysis persistence

The API communicates internally with PostgreSQL and Keycloak through Docker networks.

---

## postgres

Internal PostgreSQL database.

Responsibilities:

- SpecPilot application persistence
- Keycloak persistence

Current databases:

- specpilot
- keycloak

This service is never exposed publicly.

Persistent data is stored inside:

```text
specpilot_postgres_data
```

---

## keycloak

Centralized Identity Provider.

Public endpoint:

```text
https://auth.adrianmorillo.com
```

Responsibilities:

- Authentication
- Authorization
- Role management
- Session management
- OpenID Connect (OIDC)

Keycloak stores its persistent data inside PostgreSQL.

---

## jenkins

Continuous Integration and Continuous Deployment server.

Public endpoint:

```text
https://ci.adrianmorillo.com
```

Responsibilities:

- Docker image builds
- Deployment automation
- Infrastructure validation
- Production deployments

Persistent data is stored inside:

```text
specpilot_jenkins_data
```

---

## nginx

Public reverse proxy.

Responsibilities:

- HTTPS termination
- Reverse proxy routing
- Security headers
- Domain routing

NGINX is the only container directly exposed to the Internet.

---

# Docker Networks

The production stack is divided into two Docker networks.

## specpilot-public

Public-facing network.

Connected services:

- specpilot-frontend
- specpilot-api
- keycloak
- jenkins
- nginx

NGINX forwards external requests to these services.

---

## specpilot-private

Internal infrastructure network.

Connected services:

- specpilot-api
- postgres
- keycloak
- jenkins

Database traffic never leaves this network.

---

# Persistent Volumes

## specpilot_postgres_data

Stores PostgreSQL data.

Persists:

- SpecPilot database
- Keycloak database

---

## specpilot_jenkins_data

Stores Jenkins state.

Persists:

- Configuration
- Users
- Plugins
- Credentials
- Build history
- Pipeline definitions

---

# Environment Variables

The production stack expects:

```text
.env.production
```

A template is provided:

```text
.env.production.example
```

Only the template is versioned.

Production secrets remain outside the repository.

---

# Start Stack

From the repository root:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

# Stop Stack

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production down
```

---

# Restart Stack

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

---

# Validate Running Services

Verify running containers:

```bash
docker ps
```

Verify stack status:

```bash
docker compose -f docker-compose.prod.yml ps
```

Validate frontend:

```text
https://specpilot.adrianmorillo.com
```

Validate backend:

```text
https://api.specpilot.adrianmorillo.com/health
```

Validate Keycloak:

```text
https://auth.adrianmorillo.com
```

Validate Jenkins:

```text
https://ci.adrianmorillo.com
```

---

# Production Notes

The Docker Compose stack represents the complete production topology of the SpecPilot private beta environment.

Every service is deployed as an independent container while remaining connected through controlled Docker networks.

The stack provides:

- Containerized infrastructure
- Persistent storage
- Centralized authentication
- CI/CD integration
- Reverse proxy routing
- Secure HTTPS communication
- Production-ready service orchestration

Future ecosystem applications will reuse the same deployment strategy and infrastructure model.
