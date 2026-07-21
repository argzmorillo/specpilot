# JWT Validation

## Overview

SpecPilot secures its backend APIs using JSON Web Tokens (JWT) issued by Keycloak.

Every protected request must include a valid Bearer access token generated through the OpenID Connect authentication flow.

The backend never trusts information provided directly by frontend requests.

Instead, user identity is extracted exclusively from validated JWT access tokens.

Token validation is performed automatically by the authentication layer before protected controllers are executed.

---

# Access Token Structure

A JWT access token consists of three Base64URL-encoded sections:

```text
Header.Payload.Signature
```

Each section has a specific purpose.

```text
Header
```

Contains metadata describing how the token was signed.

```text
Payload
```

Contains identity information and authorization claims.

```text
Signature
```

Allows the backend to verify that the token was issued by the trusted Identity Provider and has not been modified.

---

# JWT Claims

Several JWT claims are used throughout the authentication process.

---

## iss

The issuer claim identifies the Identity Provider that generated the token.

Current value:

```text
http://localhost:8080/realms/ecosystem
```

The backend validates this value to ensure that tokens originate from the expected Keycloak realm.

---

## sub

The subject claim uniquely identifies the authenticated user.

Example:

```text
9f305621-906d-4142-aa95-82bd9be64a23
```

This identifier is stable for the lifetime of the user account.

Application data should reference users using this identifier rather than usernames or email addresses.

---

## aud

The audience claim identifies which backend APIs are allowed to accept the token.

Example:

```json
{
  "aud": ["account", "specpilot-api"]
}
```

The audience claim answers:

> Which service was this token issued for?

It does **not** answer:

> What is the user allowed to do?

Audience validation prevents tokens intended for one API from being accepted by another.

Application permissions are evaluated separately through roles and business authorization.

---

## azp

The Authorized Party identifies the client that requested the token.

Example:

```text
specpilot-frontend
```

This allows backend services to identify which frontend initiated the authentication process.

---

## exp

The expiration claim defines when the token becomes invalid.

Expired tokens are rejected automatically.

Users must authenticate again or obtain a refreshed token before accessing protected resources.

---

## email

The authenticated email address.

Applications use this value as trusted identity information.

Email addresses supplied manually through request bodies must never replace the authenticated email extracted from the token.

---

## preferred_username

The preferred username represents the user's login name.

Applications may use this value for display purposes.

Business data should continue using the stable `sub` identifier.

---

# Validation Pipeline

Every protected request follows the same validation sequence.

```text
Incoming Request
        │
        ▼
Bearer Access Token
        │
        ▼
Signature Validation
        │
        ▼
Issuer Validation
        │
        ▼
Audience Validation
        │
        ▼
Expiration Validation
        │
        ▼
Authenticated User
        │
        ▼
Business Authorization
```

Only after successful validation is the authenticated identity made available to the application.

---

# JWKS Validation

Keycloak signs every JWT using its private key.

The backend validates token signatures using the public keys exposed through the JSON Web Key Set (JWKS) endpoint.

Current endpoint:

```text
http://localhost:8080/realms/ecosystem/protocol/openid-connect/certs
```

Public keys are retrieved automatically and cached by the authentication layer.

This allows Keycloak to rotate signing keys without requiring backend code changes.

---

# Authentication Errors

Authentication verifies the identity of the caller.

Typical authentication failures include:

- Missing access token
- Invalid token signature
- Invalid issuer
- Invalid audience
- Expired token
- Malformed JWT

Authentication failures return:

```text
401 Unauthorized
```

The request never reaches the protected controller.

---

# Authorization Errors

Authorization determines what an authenticated user is allowed to do.

Typical authorization failures include:

- Missing application role
- Insufficient permissions
- Access request not yet approved
- Business rule restrictions

Authorization failures return:

```text
403 Forbidden
```

Unlike authentication failures, the user's identity has already been successfully validated.

---

# Current Backend Configuration

The backend validates JWT access tokens using the following configuration.

Environment variables:

```text
KEYCLOAK_ISSUER_URL
KEYCLOAK_JWKS_URI
KEYCLOAK_CLIENT_ID
```

Validation includes:

- JWT signature
- Issuer (`iss`)
- Audience (`aud`)
- Expiration (`exp`)
- Required identity claims

Once validation succeeds, the backend extracts the authenticated identity and exposes it through the authentication layer for use by protected controllers.

---

# Related Documentation

- [Authentication Overview](authentication-overview.md)
- [Authentication Architecture](auth-architecture.md)
- [Keycloak Architecture](keycloak-architecture.md)
- [Production Security Configuration](../deployment/production-security.md)
