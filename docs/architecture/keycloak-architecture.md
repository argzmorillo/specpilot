# Keycloak Architecture

## Overview

The ecosystem uses Keycloak as its centralized Identity Provider (IdP).

Keycloak manages authentication, identity information and application integration while remaining independent from application business logic.

All ecosystem applications authenticate against the same Keycloak instance and rely on the OpenID Connect (OIDC) protocol.

Authentication is centralized.

Authorization remains the responsibility of each individual application.

---

# Ecosystem Realm

The ecosystem uses a single shared Keycloak realm:

```text
ecosystem
```

The realm represents the identity boundary of the entire ecosystem.

It contains:

- User accounts
- Credentials
- Authentication sessions
- Clients
- Client scopes
- Protocol mappers
- Roles
- Authentication policies

Using a single realm provides:

- Single Sign-On (SSO)
- Shared user identities
- Centralized authentication
- Consistent user experience
- Simplified application integration

A separate realm is intentionally **not** created for every application.

---

# Realm Responsibilities

The `ecosystem` realm is responsible for identity management.

Current responsibilities include:

- User registration
- User authentication
- Password management
- Email verification
- Authentication sessions
- Access token generation
- Role management
- Client configuration

The realm does **not** contain application business information.

Business data always belongs to the application itself.

---

# Client Types

Applications are represented in Keycloak through clients.

Current clients:

```text
specpilot-frontend
specpilot-api
```

Future ecosystem applications will introduce their own frontend and API clients while continuing to use the shared realm.

---

## Frontend Clients

Frontend clients represent browser-based applications.

Example:

```text
specpilot-frontend
```

Responsibilities:

- Redirect users to Keycloak
- Start the authentication flow
- Receive authorization responses
- Obtain access tokens
- Call protected backend APIs

Frontend clients are configured as public OpenID Connect clients and therefore do not require a client secret.

Authentication security is provided through the Authorization Code Flow with PKCE.

---

## API Clients

API clients represent protected backend services.

Example:

```text
specpilot-api
```

Responsibilities:

- Define protected API resources
- Define application-specific roles
- Validate incoming access tokens
- Protect backend endpoints

Backend APIs never authenticate users directly.

Instead, they validate access tokens issued by Keycloak.

---

# Client Scopes

Client scopes define information that should be included in issued tokens.

Examples include:

- User profile
- Email
- Roles
- Audience information

Client scopes allow common token configuration to be reused across multiple clients while keeping authentication configuration consistent.

---

# Protocol Mappers

Protocol mappers transform Keycloak identity information into JWT claims.

Examples include:

- Email
- Username
- Roles
- Audience
- Custom claims

One important mapper is the Audience Mapper.

It ensures that access tokens contain the correct audience for the backend API.

Example:

```text
specpilot-api
```

This allows the backend to verify that the received token was intended for that API.

Protocol mappers enrich identity information.

They do not grant application permissions.

---

# Roles

Roles define application permissions.

Current SpecPilot roles include:

```text
specpilot_user
specpilot_admin
```

Roles determine what an authenticated user is allowed to do inside the application.

They are evaluated after successful authentication.

Receiving an access token does not automatically grant any application role.

---

# Identity Information

After successful authentication, Keycloak provides trusted identity information through JWT access tokens.

Typical identity information includes:

- User identifier
- Email address
- Username
- Display name
- Assigned roles

Applications should always trust identity information extracted from validated access tokens rather than information supplied directly by frontend requests.

---

# Local Realm Bootstrap

The local development environment automatically imports the ecosystem realm during the initial Keycloak startup.

Bootstrap configuration is stored in:

```text
infrastructure/keycloak/ecosystem-realm.json
```

This file contains the initial realm configuration, including:

- Realm definition
- Clients
- Roles
- Client scopes
- Protocol mappers

Once imported, Keycloak persists all identity information inside its PostgreSQL database.

Subsequent modifications should be performed through the Keycloak administration interface or official administration APIs.

---

# Future Expansion

The architecture has been intentionally designed to support additional ecosystem applications.

Future applications will follow the same pattern:

```text
Application Frontend
        │
        ▼
Application API
```

Each application will define:

- Its own frontend client
- Its own API client
- Its own application roles
- Its own authorization rules

All applications will continue sharing:

- The same Keycloak realm
- The same user identities
- The same authentication sessions
- The same Single Sign-On experience

This architecture allows the ecosystem to grow without duplicating authentication infrastructure.

## Related Documentation

- [Authentication Overview](authentication-overview.md)
- [Authentication Architecture](auth-architecture.md)
- [JWT Validation](jwt-validation.md)
