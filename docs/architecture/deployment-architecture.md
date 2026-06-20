# Private Beta Deployment Architecture

## Overview

This document describes the target deployment architecture for the SpecPilot private beta environment.

The goal is to provide a production-like deployment model that supports the current application while remaining compatible with future ecosystem expansion.

The architecture prioritizes:

- Shared authentication
- Centralized identity management
- Infrastructure simplicity
- Containerized deployments
- CI/CD automation
- Future ecosystem scalability

---

# Deployment Topology

The private beta environment is hosted on a dedicated VPS running Ubuntu Server.

All platform services are deployed using Docker containers and managed through Docker Compose.

Current deployment components:

- Angular Frontend
- NestJS Backend
- PostgreSQL
- Keycloak
- Jenkins
- NGINX Reverse Proxy

---

# High-Level Architecture

```text
                         Internet
                              │
                              ▼
                    adrianmorillo.com
                              │
                              ▼
                    NGINX Reverse Proxy
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼

 specpilot.adrianmorillo.com  api.specpilot.adrianmorillo.com  auth.adrianmorillo.com
      Angular               NestJS API              Keycloak

                              │
                              ▼

                     PostgreSQL Database

                              │
                              ▼

                     ci.adrianmorillo.com
                            Jenkins
```

---

# Infrastructure Components

## VPS

The VPS acts as the infrastructure host for the entire private beta environment.

Responsibilities:

- Run Docker Engine
- Host platform containers
- Provide network access
- Provide persistent storage
- Execute deployment workflows

---

## NGINX Reverse Proxy

NGINX serves as the public entry point of the platform.

Responsibilities:

- HTTPS termination
- Reverse proxy routing
- Security headers
- Request forwarding
- Optional rate limiting
- Optional response compression

Benefits:

- Industry-standard reverse proxy
- Production-proven architecture
- Fine-grained routing control
- Compatible with Let's Encrypt
- Widely used in enterprise environments

---

## Angular Frontend

Subdomain:

```text
specpilot.adrianmorillo.com
```

Responsibilities:

- User interface
- Authentication initiation
- Access request workflow
- API communication

The frontend does not contain business logic or authentication ownership.

---

## NestJS Backend

Subdomain:

```text
api.specpilot.adrianmorillo.com
```

Responsibilities:

- Business logic
- OpenAI integration
- Analysis persistence
- Access management
- Authorization enforcement

The backend validates JWT tokens issued by Keycloak.

---

## PostgreSQL

Internal service only.

Responsibilities:

- Analysis persistence
- Usage tracking
- Future access request storage
- Future ecosystem data

PostgreSQL is not exposed publicly.

---

## Keycloak

Subdomain:

auth.adrianmorillo.com

Responsibilities:

- Authentication
- Identity management
- Session management
- Role management
- Token issuing
- Single Sign-On (SSO)

Keycloak acts as the centralized Identity Provider for the ecosystem.

---

## Current Keycloak Configuration

Current realm:

specpilot

Current clients:

- specpilot-frontend
- specpilot-api

Current application roles:

- specpilot_user
- specpilot_admin

The realm configuration is versioned inside the repository:

infrastructure/keycloak/specpilot-realm.json

The Angular frontend authenticates users through OpenID Connect (OIDC).

The NestJS backend validates JWT access tokens issued by Keycloak and extracts application roles from the token payload.

User accounts are managed through the Keycloak Administration Console and are not versioned inside the repository.

---

## Jenkins

Subdomain:

```text
ci.adrianmorillo.com
```

Responsibilities:

- Build automation
- Test execution
- Deployment automation

Jenkins supports the CI/CD pipeline used to deploy SpecPilot.

---

# Service Boundaries

## Frontend

Owns:

- UI
- Navigation
- Session initialization

Does not own:

- Authentication
- Authorization
- Business logic

---

## Backend

Owns:

- Business logic
- Domain rules
- Authorization

Does not own:

- User credentials
- Session management

---

## Keycloak

Owns:

- Authentication
- Users
- Roles
- Sessions

Does not own:

- Application data

---

## PostgreSQL

Owns:

- Application persistence

Does not own:

- Authentication state

---

# Networking Strategy

Public services:

```text
specpilot.adrianmorillo.com
api.specpilot.adrianmorillo.com
auth.adrianmorillo.com
ci.adrianmorillo.com
```

Internal services:

```text
postgres
docker networks
```

Only NGINX exposes services to the Internet.

NGINX routes traffic to the appropriate internal service based on the requested domain or subdomain.

Internal services communicate exclusively through Docker networks.

---

# Future Ecosystem Compatibility

The deployment architecture is intentionally designed to support future applications.

Future ecosystem services may include:

Frontend:

- Portfolio Platform
- Vue Applications
- React Applications

Backend:

- Spring Boot APIs
- FastAPI Services
- Additional NestJS Services

Potential future topology:

```text
adrianmorillo.com

specpilot.adrianmorillo.com
future-app.adrianmorillo.com

api.specpilot.adrianmorillo.com
api.spring.adrianmorillo.com
api.adrianmorillo.com

auth.adrianmorillo.com
ci.adrianmorillo.com
```

All future applications will reuse:

- Keycloak
- PostgreSQL strategy
- CI/CD infrastructure
- Deployment model
- Domain management

---

# Deployment Strategy

Deployment flow:

```text
Developer
    │
    ▼
GitHub
    │
    ▼
Jenkins Pipeline
    │
    ▼
Docker Build
    │
    ▼
Docker Compose Deployment
    │
    ▼
Production VPS
```

The deployment process remains reproducible, automated and compatible with future ecosystem expansion.

---

# Long-Term Vision

SpecPilot is the first application of a broader portfolio ecosystem.

The deployment architecture is designed to demonstrate:

- Enterprise deployment practices
- Shared authentication
- CI/CD automation
- Containerized infrastructure
- Cross-application scalability
- Production-oriented architecture
- Centralized reverse proxy architecture

```

```
