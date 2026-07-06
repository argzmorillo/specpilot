# Production Security Configuration

## Overview

SpecPilot applies production-oriented security controls across the entire private beta infrastructure.

Security is enforced through multiple independent layers including reverse proxy protection, HTTPS, centralized authentication, Docker network isolation, JWT validation and Role-Based Access Control (RBAC).

The objective is to minimize the public attack surface while maintaining a reproducible deployment architecture suitable for future ecosystem expansion.

---

# Security Layers

The production environment follows a layered security model.

Current security layers include:

- HTTPS termination
- Reverse proxy isolation
- Docker network isolation
- JWT authentication
- Role-Based Access Control (RBAC)
- CORS restrictions
- Request validation
- HTTP security headers
- Secret isolation

No single component is responsible for platform security.

---

# HTTPS Enforcement

All public services are exposed exclusively through HTTPS.

Current public endpoints:

```text
https://specpilot.adrianmorillo.com
https://api.specpilot.adrianmorillo.com
https://auth.adrianmorillo.com
https://ci.adrianmorillo.com
```

Public HTTP traffic is automatically redirected to HTTPS.

The only HTTP exception is the Let's Encrypt ACME challenge:

```text
/.well-known/acme-challenge/
```

This endpoint remains available to support automatic certificate renewal.

---

# Reverse Proxy Security

NGINX is the only publicly exposed container.

Responsibilities include:

- HTTPS termination
- Reverse proxy routing
- Security headers
- Domain routing
- Service isolation

Application containers never receive requests directly from the Internet.

---

# Docker Network Isolation

The infrastructure is divided into two Docker networks.

## Public Network

```text
specpilot-public
```

Contains services exposed through NGINX.

## Private Network

```text
specpilot-private
```

Contains internal infrastructure services.

PostgreSQL is never publicly accessible.

Database communication occurs exclusively through the private Docker network.

---

# CORS Policy

The backend does not allow wildcard CORS.

Allowed origins are configured through:

```text
CORS_ALLOWED_ORIGINS
```

Current production origin:

```text
https://specpilot.adrianmorillo.com
```

If no allowed origins are configured, the backend refuses to start.

This prevents accidental public exposure caused by permissive CORS configurations.

---

# Authentication

Authentication is centralized through Keycloak.

Identity Provider:

```text
https://auth.adrianmorillo.com
```

Authentication uses:

- OpenID Connect (OIDC)
- OAuth 2.0 Authorization Code Flow
- JWT Access Tokens

User credentials are never processed or stored by the frontend or backend.

---

# JWT Protection

Protected backend endpoints require a valid JWT access token issued by Keycloak.

Every protected request validates:

- Token signature
- Token issuer
- Expected audience
- Token expiration
- Assigned application roles

JWT validation is performed using Keycloak's JWKS endpoint.

---

# Authorization

Authorization is enforced inside the NestJS backend.

Current application roles include:

- specpilot_user
- specpilot_admin

Protected endpoints validate both authentication and authorization before executing business logic.

---

# Backend Security

The backend applies several runtime protections.

Helmet provides standard HTTP security headers.

A global ValidationPipe performs:

- Property whitelisting
- Property transformation
- Rejection of unexpected payload fields

These protections reduce accidental acceptance of malformed or malicious requests.

---

# Reverse Proxy Security Headers

NGINX applies security headers to every HTTPS response.

Current headers include:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

These headers reduce browser-based attack vectors and enforce secure transport.

---

# Secret Management

Production secrets are intentionally excluded from version control.

Sensitive configuration is stored inside:

```text
.env.production
```

The repository only includes:

```text
.env.production.example
```

This prevents accidental credential disclosure.

---

# Persistent Authentication

Keycloak stores its production state inside PostgreSQL.

Persisted data includes:

- Users
- Roles
- Sessions
- Realm configuration
- Client configuration

Realm configuration is imported only during initial provisioning.

Subsequent deployments reuse the existing database state.

---

# Error Exposure

Production services execute with:

```text
NODE_ENV=production
```

Public responses avoid exposing development diagnostics.

Operational troubleshooting is performed through Docker container logs rather than HTTP responses.

---

# Production Assumptions

Current production assumptions:

- NGINX is the only public entry point
- HTTPS is mandatory
- PostgreSQL is private
- Authentication is centralized in Keycloak
- Authorization is enforced by the backend
- Docker networks isolate internal services
- Secrets remain outside Git
- Certificates are managed on the VPS
- Persistent data survives container recreation

---

# Validation Commands

## Validate frontend

```bash
curl -I https://specpilot.adrianmorillo.com
```

---

## Validate backend

```bash
curl https://api.specpilot.adrianmorillo.com/health
```

Expected:

```text
{"status":"ok","database":"up"}
```

---

## Validate CORS

```bash
curl -I https://api.specpilot.adrianmorillo.com/health \
-H "Origin: https://specpilot.adrianmorillo.com"
```

Expected:

```text
Access-Control-Allow-Origin: https://specpilot.adrianmorillo.com
```

---

## Validate protected endpoint

```bash
curl -I https://api.specpilot.adrianmorillo.com/analysis
```

Expected:

```text
401 Unauthorized
```

Authenticated users with the appropriate role should be able to access protected endpoints successfully.

---

## Validate security headers

```bash
curl -I https://specpilot.adrianmorillo.com
curl -I https://api.specpilot.adrianmorillo.com/health
curl -I https://auth.adrianmorillo.com
curl -I https://ci.adrianmorillo.com
```

Expected headers include:

```text
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

---

# Related Files

```text
backend/src/main.ts
docker-compose.prod.yml
infrastructure/nginx/nginx.conf
infrastructure/keycloak/specpilot-realm.json
```
