# Production Security Configuration

## Overview

SpecPilot applies production-oriented security defaults to reduce development-only exposure and enforce safer runtime behavior.

This document describes the current production security assumptions for the private beta deployment.

---

## CORS Policy

The backend does not use wildcard CORS.

Allowed origins are configured through the `CORS_ALLOWED_ORIGINS` environment variable.

Current production origin:

```text
https://specpilot.adrianmorillo.com
```

If `CORS_ALLOWED_ORIGINS` is not defined, the backend fails to start.

This prevents accidental public exposure caused by permissive default CORS behavior.

---

## Backend Security Headers

The NestJS backend uses Helmet to apply common HTTP security headers.

Helmet is enabled during application bootstrap.

The backend disables the default cross-origin resource policy because SpecPilot uses a separated frontend/API/domain architecture.

---

## Request Validation

SpecPilot uses a global NestJS `ValidationPipe`.

Current validation behavior:

- Whitelists allowed DTO properties
- Rejects non-whitelisted properties
- Transforms incoming request payloads

This reduces accidental acceptance of unexpected request data.

---

## Reverse Proxy Security Headers

NGINX applies security headers on HTTPS responses.

Current headers:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

These headers reduce browser-level attack surface and enforce HTTPS usage.

---

## HTTPS Enforcement

Public HTTP traffic is redirected to HTTPS.

The only HTTP exception is the Let's Encrypt challenge route:

```text
/.well-known/acme-challenge/
```

This route must remain publicly available over HTTP for certificate renewal.

---

## JWT Protection

Protected backend endpoints require a valid JWT access token issued by Keycloak.

The backend validates:

- Token issuer
- Token signature through JWKS
- Expected audience/client configuration
- Application roles where required

The current authentication provider is:

```text
https://auth.adrianmorillo.com/realms/specpilot
```

---

## Error Exposure

The production environment runs with:

```text
NODE_ENV=production
```

The application should avoid exposing development-only error details to public clients.

Detailed diagnostics should be inspected through container logs instead of public HTTP responses.

---

## Public Services

Current public services:

```text
https://specpilot.adrianmorillo.com
https://api.specpilot.adrianmorillo.com
https://auth.adrianmorillo.com
```

Deferred public service:

```text
https://ci.adrianmorillo.com
```

Jenkins security will be completed when the Jenkins service is deployed.

---

## Production Assumptions

Current production assumptions:

- Public access enters through NGINX only
- PostgreSQL is not publicly exposed
- Backend API is accessed through HTTPS
- Authentication is centralized in Keycloak
- Allowed frontend origins are explicitly configured
- Secrets are stored outside Git in `.env.production`
- Certificates are stored on the VPS under `/etc/letsencrypt`
- Certbot renewal uses the webroot strategy

---

## Validation Commands

### Validate CORS origin

```bash
curl -I https://api.specpilot.adrianmorillo.com/health \
  -H "Origin: https://specpilot.adrianmorillo.com"
```

Expected:

```text
Access-Control-Allow-Origin: https://specpilot.adrianmorillo.com
```

---

### Validate security headers

```bash
curl -I https://specpilot.adrianmorillo.com
curl -I https://api.specpilot.adrianmorillo.com/health
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

### Validate protected endpoint

```bash
curl -I https://api.specpilot.adrianmorillo.com/analysis
```

Expected:

```text
401 Unauthorized
```

A valid authenticated frontend session should still be able to access protected resources.

---

## Related Files

```text
backend/src/main.ts
infrastructure/nginx/nginx.conf
docker-compose.prod.yml
```
