# NGINX Reverse Proxy Routing

## Overview

SpecPilot uses NGINX as the centralized reverse proxy for the private beta deployment environment.

NGINX acts as the single public entry point for platform traffic and routes requests to the appropriate internal service based on the requested domain or subdomain.

This reverse proxy layer belongs to the infrastructure layer of the private beta environment, not to the SpecPilot application domain itself.

---

## Responsibilities

NGINX is responsible for:

- Public request routing
- Domain and subdomain-based routing
- Reverse proxy forwarding
- Security headers
- Future HTTPS termination
- Future HTTP to HTTPS redirection
- Future rate limiting and compression

---

## Target Public Routes

| Domain                            | Target Service        | Status      |
| --------------------------------- | --------------------- | ----------- |
| `adrianmorillo.com`               | Portfolio frontend    | Placeholder |
| `www.adrianmorillo.com`           | Portfolio frontend    | Placeholder |
| `specpilot.adrianmorillo.com`     | SpecPilot frontend    | Configured  |
| `api.specpilot.adrianmorillo.com` | SpecPilot backend API | Configured  |
| `auth.adrianmorillo.com`          | Keycloak              | Configured  |
| `ci.adrianmorillo.com`            | Jenkins               | Placeholder |

---

## Internal Docker Routing

NGINX routes public traffic to internal Docker services through the Docker network.

Current internal targets:

```text
specpilot-frontend:80
specpilot-api:3000
keycloak:8080
```

Future internal targets:

```text
portfolio-frontend:80
jenkins:8080
```

---

## Current Routing Behavior

### Portfolio

The root portfolio domain is reserved for the main public portfolio website.

```text
adrianmorillo.com
www.adrianmorillo.com
```

The portfolio service is not deployed yet, so the current NGINX route may return a placeholder response.

---

### SpecPilot Frontend

```text
specpilot.adrianmorillo.com
```

Routes to:

```text
specpilot-frontend:80
```

This serves the Angular production build through the frontend NGINX container.

---

### SpecPilot Backend API

```text
api.specpilot.adrianmorillo.com
```

Routes to:

```text
specpilot-api:3000
```

This exposes the NestJS backend API through the reverse proxy.

---

### Keycloak

```text
auth.adrianmorillo.com
```

Routes to:

```text
keycloak:8080
```

Keycloak is configured to run behind a reverse proxy and uses forwarded headers to generate correct public URLs.

Required Keycloak reverse proxy variables:

```text
KC_HOSTNAME=auth.adrianmorillo.com
KC_HOSTNAME_PORT=80
KC_PROXY_HEADERS=xforwarded
KC_HTTP_ENABLED=true
```

In production HTTPS, the public port will be handled by the HTTPS configuration.

---

### Jenkins

```text
ci.adrianmorillo.com
```

Jenkins routing is reserved for the CI/CD service.

The Jenkins service is not deployed yet, so the current NGINX route may return a placeholder response.

---

## Local Validation

Until DNS and HTTPS are configured in the VPS, local routing can be validated using the `Host` header.

### Validate SpecPilot Frontend

```bash
curl -I -H "Host: specpilot.adrianmorillo.com" http://localhost
```

### Validate SpecPilot API

```bash
curl -H "Host: api.specpilot.adrianmorillo.com" http://localhost
```

Expected response:

```text
Hello World!
```

### Validate Keycloak

```bash
curl -v -H "Host: auth.adrianmorillo.com" http://localhost
```

Expected behavior:

```text
HTTP/1.1 302 Found
Location: http://auth.adrianmorillo.com/admin/
```

### Validate Portfolio Placeholder

```bash
curl -H "Host: adrianmorillo.com" http://localhost
```

### Validate Jenkins Placeholder

```bash
curl -H "Host: ci.adrianmorillo.com" http://localhost
```

---

## HTTPS Strategy

HTTPS is not fully validated in local development because Let's Encrypt requires:

- Public DNS records
- A public VPS IP address
- Public access to ports 80 and 443

HTTPS will be completed in a dedicated production infrastructure issue.

Target HTTPS services:

```text
https://adrianmorillo.com
https://specpilot.adrianmorillo.com
https://api.specpilot.adrianmorillo.com
https://auth.adrianmorillo.com
https://ci.adrianmorillo.com
```

---

## Production Notes

In production, NGINX should be the only service exposed publicly.

Application services should communicate internally through Docker networks.

Public traffic should follow this pattern:

```text
Internet
  ↓
NGINX Reverse Proxy
  ↓
Internal Docker Service
```

Internal services should not expose public ports directly unless required for controlled operational access.

---

## Future Improvements

Planned improvements include:

- HTTPS termination
- Let's Encrypt certificate generation
- Automatic certificate renewal
- HTTP to HTTPS redirection
- Security headers hardening
- Rate limiting
- Gzip/Brotli compression
- Jenkins routing once CI/CD is deployed
- Portfolio routing once the portfolio service is deployed
