# Shared Authentication Architecture

## Overview

SpecPilot AI is being designed as the first application of a broader portfolio ecosystem composed of multiple frontend and backend applications built with different technologies.

The ecosystem goal is to provide:

- Shared authentication
- Single Sign-On (SSO)
- Centralized identity management
- Shared access control
- Cross-application session reuse
- Technology-agnostic authentication flows

To support these requirements, the authentication architecture must remain decoupled from any individual application implementation.

---

# Authentication Strategy

## OAuth2 vs OpenID Connect (OIDC)

OAuth2 is primarily an authorization framework designed to grant applications access to protected resources.

However, SpecPilot requires:

- User authentication
- Shared user identity
- Session reuse across applications
- Centralized login
- Single Sign-On (SSO)

For this reason, OpenID Connect (OIDC) was selected as the authentication standard.

OIDC extends OAuth2 by adding:

- User identity
- ID tokens
- Authentication flows
- Standardized login/session handling

This makes OIDC more suitable for a multi-application ecosystem architecture.

---

# Centralized Identity Strategy

The ecosystem will use a centralized Identity Provider (IdP).

The Identity Provider is responsible for:

- User authentication
- Session management
- Token issuing
- Role management
- Identity lifecycle
- Single Sign-On (SSO)

Applications themselves will not own user credentials directly.

Instead, applications trust the centralized identity provider and validate the tokens it issues.

---

# Keycloak vs Custom Authentication

## Evaluated Approaches

### Custom Authentication Service

Pros:

- Full implementation ownership
- Deeper low-level authentication learning

Cons:

- Reinvents existing IAM standards
- Higher security risk
- Significant implementation complexity
- Difficult to maintain securely
- Harder to scale across multiple applications

### Keycloak

Pros:

- Industry-standard Identity Provider
- Native OIDC/OAuth2 support
- Built-in SSO support
- Centralized user and role management
- Multi-application compatibility
- Compatible with Angular, Vue, React, NestJS, Spring Boot and FastAPI
- Enterprise-oriented architecture

Cons:

- Additional infrastructure complexity
- Less focus on implementing authentication internals manually

---

# Technology Decision

The ecosystem will adopt:

- Keycloak as centralized Identity Provider
- OpenID Connect (OIDC) as authentication protocol
- JWT access tokens for API authorization
- Shared realm architecture for future applications

This approach prioritizes:

- Security standards
- Ecosystem scalability
- Shared authentication
- Cross-stack compatibility
- Enterprise-oriented architecture

---

# Ecosystem Authentication Architecture

```text
                    ┌─────────────────────┐
                    │      Keycloak       │
                    │ Identity Provider   │
                    └─────────┬───────────┘
                              │
               OIDC / JWT / SSO
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼

┌───────────────┐   ┌────────────────┐   ┌────────────────┐
│ SpecPilot     │   │ Future Vue App │   │ Future React App│
│ Angular Front │   │ Vue Frontend   │   │ React Frontend  │
└───────┬───────┘   └────────┬───────┘   └────────┬───────┘
        │                    │                    │
        ▼                    ▼                    ▼

┌───────────────┐   ┌────────────────┐   ┌────────────────┐
│ NestJS API    │   │ Spring Boot API│   │ FastAPI Service │
└───────────────┘   └────────────────┘   └────────────────┘
```

---

# Single Sign-On (SSO) Flow

1. User accesses an application.
2. The frontend detects that the user is not authenticated.
3. The user is redirected to Keycloak.
4. Keycloak authenticates the user.
5. Keycloak returns OIDC tokens to the frontend.
6. The frontend stores session/token state.
7. The frontend sends Bearer tokens to backend APIs.
8. Backend APIs validate JWT tokens issued by Keycloak.
9. Access is granted or rejected based on token validity and roles.
10. Future applications reuse the same authentication session through SSO.

---

# Current Frontend OIDC Integration

The current SpecPilot frontend integrates directly with Keycloak using OpenID Connect (OIDC).

Current implemented capabilities:

- Centralized login through Keycloak
- Shared session handling
- Automatic login redirection
- Logout flow through the Identity Provider
- Frontend route protection foundation
- Session persistence across page reloads
- Runtime token management through Keycloak client integration

The Angular frontend does not own authentication logic directly and delegates identity management entirely to the centralized Identity Provider.

# Shared Authentication Boundaries

## Keycloak Responsibilities

- Authentication
- User credentials
- Password policies
- Sessions
- Token issuing
- Role management
- Identity management
- Single Sign-On

## Frontend Responsibilities

- Login redirects
- Session persistence
- Route protection
- Token attachment to API calls
- Logout flow
- OIDC session initialization

## Frontend Token Storage Strategy

The frontend does not implement custom token persistence in localStorage.

OIDC token lifecycle and session state are delegated to the Keycloak client integration. Tokens are consumed at runtime by the Angular application and will later be attached to backend API requests through an HTTP interceptor.

This avoids introducing custom token storage logic at this stage and keeps the authentication flow aligned with the Identity Provider.

## Backend Responsibilities

- JWT validation
- Authorization guards
- Role extraction
- Protected endpoint enforcement
- Domain-specific authorization rules

## Application Database Responsibilities

The application database remains responsible only for domain data such as:

- Analysis history
- AI usage tracking
- Future application-specific data

The database is not responsible for authentication state management.

---

# JWT Validation Flow

```text
Frontend
    ↓
Bearer Access Token
    ↓
Backend API
    ↓
JWT Validation
    ├── Signature validation
    ├── Issuer validation
    ├── Expiration validation
    ├── Audience/client validation
    └── Role extraction
    ↓
Authorized / Rejected
```

---

## Backend JWT Protection

The NestJS backend validates Keycloak-issued JWT access tokens using the realm issuer, JWKS public keys and the expected API audience.

Protected endpoints require an `Authorization: Bearer <access_token>` header.

Current protected endpoints:

- `POST /ai/analyze`
- `GET /analysis`

The backend extracts authenticated user metadata and roles from the token payload to prepare future RBAC support.

# Future Ecosystem Expansion

Future applications should only require:

- OIDC client configuration
- Shared realm integration
- JWT validation
- Frontend route protection

This allows future applications to integrate authentication independently of their technology stack.

Planned compatible stacks include:

- Angular
- Vue
- React
- NestJS
- Spring Boot
- FastAPI

---

# Long-Term Vision

The long-term goal is to evolve the portfolio ecosystem into a multi-application architecture demonstrating:

- Shared authentication
- Centralized identity management
- Enterprise-oriented access control
- Cross-stack interoperability
- Modern API security practices
- Modular application boundaries
- Scalable authentication architecture

# Local Development Setup

## Docker Infrastructure

The local development environment currently includes:

- PostgreSQL
- Keycloak

Run local infrastructure:

```bash
docker compose up -d
```

---

## Local Services

### PostgreSQL

```text
localhost:5432
```

### Keycloak

```text
http://localhost:8080
```

---

## Development Credentials

### Keycloak Admin

```text
admin / admin
```

---

## Current Realm

```text
specpilot
```

---

## Initial Clients

```text
specpilot-frontend
specpilot-api
```

---

## Initial Roles

```text
specpilot_user
specpilot_admin
```
