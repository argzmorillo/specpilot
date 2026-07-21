# Authentication Overview

## Overview

SpecPilot is the first application of a broader portfolio ecosystem designed to simulate enterprise-grade software architecture.

The ecosystem is built around a centralized authentication platform that provides a shared identity across all current and future applications.

Instead of implementing authentication independently in every application, identity management is delegated to a dedicated Identity Provider using the OpenID Connect (OIDC) protocol.

This approach provides:

- Centralized authentication
- Single Sign-On (SSO)
- Shared identity management
- Secure API communication
- Technology-independent authentication
- Scalable ecosystem integration

Applications remain responsible for their own business logic and authorization while relying on a common authentication platform.

---

# Why Centralized Authentication?

Authentication is treated as an ecosystem capability rather than an application feature.

A centralized identity platform provides several advantages:

- One account per user
- Shared authentication sessions
- Consistent login experience
- Simplified user management
- Reduced security complexity
- Standardized authentication flows
- Easier integration of future applications

This architecture avoids duplicated authentication implementations while allowing each application to evolve independently.

---

# Authentication Stack

The ecosystem currently uses the following authentication technologies:

| Component               | Technology                        |
| ----------------------- | --------------------------------- |
| Identity Provider       | Keycloak                          |
| Authentication Protocol | OpenID Connect (OIDC)             |
| Authorization Framework | OAuth 2.0                         |
| Authentication Flow     | Authorization Code Flow with PKCE |
| Token Format            | JWT                               |
| Backend Validation      | JWKS                              |
| Identity Persistence    | PostgreSQL                        |

This stack follows widely adopted enterprise authentication standards.

---

# High-Level Architecture

```text
                    User
                      │
                      ▼
              Keycloak Identity Provider
                      │
             OpenID Connect (OIDC)
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼

   Portfolio      SpecPilot     Future Applications
    Frontend       Frontend

        │             │
        ▼             ▼

   Portfolio API  SpecPilot API
```

Authentication is centralized.

Authorization remains application-specific.

---

# Authentication Flow

Every authenticated request follows the same high-level process.

```text
User
    │
    ▼
Application Frontend
    │
    ▼
Redirect to Keycloak
    │
    ▼
User Authentication
    │
    ▼
Access Token Issued
    │
    ▼
Frontend calls Backend API
    │
    ▼
Backend validates JWT
    │
    ▼
Protected Resource
```

User credentials are never processed by frontend or backend applications.

Authentication is fully handled by Keycloak.

---

# Authentication vs Authorization

Authentication and authorization serve different purposes.

Authentication answers:

- Who is the user?
- Has the user successfully authenticated?
- Is the access token valid?

Authorization answers:

- Can this authenticated user access this application?
- Which operations is the user allowed to perform?
- Which business rules apply?

Keycloak authenticates users.

Each application authorizes users independently according to its own business rules.

---

# Current Applications

The current ecosystem includes:

- Portfolio
- SpecPilot AI

Both applications share the same centralized authentication platform while maintaining independent business domains.

---

# Future Ecosystem

The authentication architecture has been designed to support future expansion.

Potential future applications include:

- CRM
- Administration Portal
- Project Management
- Monitoring Dashboard
- Additional AI-powered services

New applications should integrate with the existing authentication platform without requiring changes to the overall authentication architecture.

---

# Related Documentation

- [Authentication Architecture](auth-architecture.md)
- [Keycloak Architecture](keycloak-architecture.md)
- [JWT Validation](jwt-validation.md)
- [Environment Configuration](environment-configuration.md)
