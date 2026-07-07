# Private Beta Deployment Architecture

## Overview

This document describes the production deployment architecture currently used by the SpecPilot private beta environment.

The architecture reflects the live infrastructure running on the production VPS and serves as the foundation for the current private beta while remaining compatible with future ecosystem expansion.

The architecture prioritizes:

- Shared authentication
- Centralized identity management
- Infrastructure simplicity
- Containerized deployments
- CI/CD automation
- Production reliability
- Future ecosystem scalability

---

# Deployment Topology

The private beta environment is hosted on a dedicated Ubuntu Server VPS.

All production services are containerized using Docker and orchestrated through a single Docker Compose stack, providing reproducible deployments, simplified infrastructure management and consistent environments.

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
        ┌──────────────────────┼──────────────────────┬──────────────────────┐
        │                      │                      │                      │
        ▼                      ▼                      ▼                      ▼

specpilot.adrianmorillo.com  api.specpilot.adrianmorillo.com  auth.adrianmorillo.com  ci.adrianmorillo.com
      Angular                    NestJS API                     Keycloak                 Jenkins
                                    │
                                    ▼
                              PostgreSQL
```

---

# Infrastructure Components

## VPS

The VPS acts as the infrastructure host for the entire private beta environment.

Responsibilities:

- Run Docker Engine
- Host all platform containers
- Provide network access
- Provide persistent storage
- Execute deployment workflows
- Host TLS certificates
- Support future ecosystem expansion

---

## NGINX Reverse Proxy

NGINX serves as the public entry point of the platform.

Responsibilities:

- HTTPS termination
- Reverse proxy routing
- Security headers
- Request forwarding
- Domain routing
- TLS certificate usage
- Optional rate limiting
- Optional response compression

Benefits:

- Industry-standard reverse proxy
- Production-proven architecture
- Fine-grained routing control
- Compatible with Let's Encrypt
- Widely adopted in enterprise environments

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

The frontend does not own business logic, authorization or user credentials.

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

The backend validates JWT access tokens issued by Keycloak and enforces Role-Based Access Control (RBAC).

---

## PostgreSQL

Internal service only.

Responsibilities:

- Application persistence
- Analysis storage
- Usage tracking
- Keycloak persistence
- Future access request storage
- Future ecosystem data

Current production databases:

- specpilot
- keycloak

PostgreSQL is never exposed publicly.

---

## Keycloak

Subdomain:

```text
auth.adrianmorillo.com
```

Responsibilities:

- Authentication
- Identity management
- Session management
- Role management
- Token issuing
- Single Sign-On (SSO)

Keycloak acts as the centralized Identity Provider for the entire ecosystem.

### Current Configuration

Current realm:

```text
specpilot
```

Current clients:

- specpilot-frontend
- specpilot-api

Current application roles:

- specpilot_user
- specpilot_admin

The realm configuration is versioned inside:

```text
infrastructure/keycloak/specpilot-realm.json
```

The Angular frontend authenticates users through OpenID Connect (OIDC).

The NestJS backend validates JWT access tokens issued by Keycloak and extracts application roles directly from the token payload.

All users, sessions, roles and realm state are persisted inside PostgreSQL.

The realm is imported only during initial infrastructure provisioning. Subsequent container restarts reuse the persisted database state without re-importing the realm, preserving all production users and configuration.

---

## Jenkins

Subdomain:

```text
ci.adrianmorillo.com
```

Responsibilities:

- Build automation
- Continuous Integration
- Docker image builds
- Continuous Deployment
- Deployment validation

Current deployment capabilities:

- Build Backend Docker image
- Build Frontend Docker image
- Deploy production containers
- Execute production database migrations
- Validate deployment through health checks

---

# Service Boundaries

## Frontend

Owns:

- User interface
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
- AI integrations

Does not own:

- User credentials
- Session lifecycle

---

## Keycloak

Owns:

- Authentication
- Users
- Roles
- Sessions
- Token generation

Does not own:

- Application business data

---

## PostgreSQL

Owns:

- Persistent application data
- Authentication persistence

Does not own:

- Authentication logic

---

# Networking Strategy

The infrastructure is divided into two Docker networks.

## Public Network

```text
specpilot-public
```

Contains services exposed through NGINX.

Services:

- Frontend
- Backend
- Keycloak
- Jenkins
- NGINX

---

## Private Network

```text
specpilot-private
```

Contains internal-only communication.

Services:

- PostgreSQL
- Backend
- Keycloak
- Jenkins

Database traffic never leaves the private Docker network.

Only NGINX exposes services to the Internet.

NGINX routes traffic to the appropriate service based on the requested domain.

---

# Security Model

The production environment follows a layered security model.

Security measures include:

- HTTPS termination at NGINX
- Reverse proxy isolation
- Internal Docker networking
- PostgreSQL not publicly accessible
- JWT validation inside the backend
- Centralized authentication through Keycloak
- Role-Based Access Control (RBAC)
- Security headers configured at the reverse proxy
- Persistent authentication stored in PostgreSQL

---

# Deployment Strategy

Deployment flow:

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
Jenkins Pipeline
    │
    ▼
Checkout latest revision
    │
    ▼
Build Docker images
    │
    ▼
Optional Production Deployment
    │
    ▼
Docker Compose
    │
    ▼
Prisma Migrations
    │
    ▼
Health Check Validation
    │
    ▼
Production Environment
```

The deployment process is reproducible, automated and designed to minimize manual intervention while preserving persistent production data.

---

# Future Ecosystem Compatibility

The deployment architecture is intentionally designed to support future applications.

Potential frontend services:

- Portfolio Platform
- Vue Applications
- React Applications

Potential backend services:

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

Future applications will reuse:

- Keycloak
- PostgreSQL strategy
- CI/CD infrastructure
- Deployment model
- Domain management
- Reverse proxy architecture

---

# Long-Term Vision

SpecPilot is the first application within a broader portfolio ecosystem.

Although SpecPilot is currently the only production application, every infrastructure decision has been made with ecosystem scalability as the primary design goal.

The deployment architecture demonstrates:

- Enterprise deployment practices
- Shared authentication
- Centralized identity management
- CI/CD automation
- Containerized infrastructure
- Production-oriented architecture
- Cross-application scalability
- Centralized reverse proxy architecture
- Secure authentication and authorization
- Reproducible deployments
