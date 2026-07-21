# Shared Authentication Architecture

## Overview

This document describes how authentication is implemented inside the SpecPilot application.

It focuses on the interaction between the Angular frontend, the NestJS backend and the shared Keycloak identity platform.

For authentication concepts and architectural decisions see:

- [Authentication Overview](authentication-overview.md)
- [Keycloak Architecture](keycloak-architecture.md)
- [JWT Validation](jwt-validation.md)

---

# Current Frontend OIDC Integration

The SpecPilot frontend integrates directly with Keycloak using the OpenID Connect (OIDC) protocol.

Current capabilities include:

- Centralized login through Keycloak
- Automatic login redirection
- Shared session handling
- Logout through the Identity Provider
- Frontend route protection
- Session persistence
- Runtime access token management

The Angular application never authenticates users directly.

Authentication is entirely delegated to the centralized Identity Provider.

---

# Shared Authentication Responsibilities

## Keycloak

Responsible for:

- User authentication
- User credentials
- Password policies
- Identity lifecycle
- Session management
- Token issuance
- Role management
- Single Sign-On (SSO)

---

## Angular Frontend

Responsible for:

- Login redirection
- Logout
- Route protection
- Access token forwarding
- OIDC initialization
- Session state

The frontend never validates JWT tokens.

---

## NestJS Backend

Responsible for:

- JWT validation
- Authenticated user extraction
- Authorization guards
- Role extraction
- Protected endpoint enforcement
- Business authorization

Authentication is delegated to Keycloak.

Authorization remains application-specific.

---

## Application Database

The SpecPilot database stores only business information.

Examples include:

- Analysis history
- Access requests
- AI usage metadata
- Future application data

Authentication state is never persisted inside the application database.

---

# Frontend Token Management

SpecPilot does not implement custom authentication storage.

Token lifecycle management is delegated entirely to the Keycloak JavaScript adapter.

The frontend retrieves access tokens at runtime and attaches them automatically to backend requests through the HTTP interceptor.

This approach avoids custom authentication logic while remaining aligned with the OpenID Connect specification.

---

# Ecosystem Role Foundation

The current authorization model introduces a lightweight RBAC foundation.

Current application roles:

```text
specpilot_user
specpilot_admin
```

Roles are extracted from validated access tokens and normalized before reaching the application layer.

Route-level authorization remains intentionally lightweight while the platform evolves.

---

# Role Sources

The backend currently supports extracting roles from:

```text
realm_access.roles
resource_access.{client}.roles
```

Only roles explicitly recognized by the ecosystem are accepted.

Unknown Keycloak roles are ignored.

---

# Authenticated User Contract

After successful JWT validation, the backend exposes a normalized authenticated user.

```ts
{
  sub: string;
  email: string;
  name?: string;
  username?: string;
  roles: EcosystemRole[];
}
```

Application services never consume the raw JWT payload directly.

---

# Current Authorization Scope

The authentication layer currently provides:

- JWT validation
- Issuer validation
- Audience validation
- Authenticated user extraction
- Role normalization

The current implementation intentionally does not yet include:

- Fine-grained permissions
- Permission-based authorization
- Role hierarchy
- Administrative policies

These capabilities will be introduced only when required by future business requirements.

---

# Future RBAC Evolution

The current RBAC foundation has been designed to evolve gradually.

Potential future roles include:

```text
ecosystem_admin
portfolio_user
specpilot_viewer
specpilot_manager
```

Future enhancements may include:

- Role-based route guards
- Administrative dashboards
- Shared ecosystem administration
- Permission-based authorization

The architecture intentionally evolves from authentication, to role extraction, to role enforcement, only when business requirements justify additional complexity.

---

# Related Documentation

- [Authentication Overview](authentication-overview.md)
- [Keycloak Architecture](keycloak-architecture.md)
- [JWT Validation](jwt-validation.md)
- [Environment Configuration](environment-configuration.md)
