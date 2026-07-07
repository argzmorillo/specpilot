# NGINX Reverse Proxy Routing

## Overview

SpecPilot uses NGINX as the centralized reverse proxy for the production private beta environment.

NGINX acts as the single public entry point for every platform service and routes incoming requests to the appropriate internal Docker container based on the requested domain or subdomain.

The reverse proxy provides a centralized networking layer, HTTPS termination, security headers and service isolation while keeping the application services hidden from direct Internet access.

---

# Responsibilities

NGINX is responsible for:

- HTTPS termination
- HTTP to HTTPS redirection
- Domain and subdomain routing
- Reverse proxy forwarding
- Security headers
- Request forwarding
- Future rate limiting
- Future response compression

---

# Public Routes

| Domain                            | Target Service        | Status      |
| --------------------------------- | --------------------- | ----------- |
| `adrianmorillo.com`               | Portfolio             | Placeholder |
| `www.adrianmorillo.com`           | Portfolio             | Placeholder |
| `specpilot.adrianmorillo.com`     | SpecPilot Frontend    | Active      |
| `api.specpilot.adrianmorillo.com` | SpecPilot Backend API | Active      |
| `auth.adrianmorillo.com`          | Keycloak              | Active      |
| `ci.adrianmorillo.com`            | Jenkins               | Active      |

---

# Internal Docker Routing

NGINX forwards requests to internal Docker services.

Current routing targets:

```text
specpilot-frontend:80
specpilot-api:3000
keycloak:8080
jenkins:8080
```

Future routing targets may include:

```text
portfolio-frontend:80
future-app:80
future-api:8080
```

---

# Current Routing Behaviour

## Portfolio

```text
adrianmorillo.com
www.adrianmorillo.com
```

The portfolio is not yet deployed.

NGINX currently returns a placeholder response while reserving the domain for the future portfolio application.

---

## SpecPilot Frontend

```text
specpilot.adrianmorillo.com
```

Routes to:

```text
specpilot-frontend:80
```

Serves the Angular production application.

---

## SpecPilot Backend API

```text
api.specpilot.adrianmorillo.com
```

Routes to:

```text
specpilot-api:3000
```

Exposes the NestJS REST API.

---

## Keycloak

```text
auth.adrianmorillo.com
```

Routes to:

```text
keycloak:8080
```

Keycloak operates behind the reverse proxy using forwarded headers.

Current reverse proxy configuration:

```text
KC_HOSTNAME=auth.adrianmorillo.com
KC_PROXY_HEADERS=xforwarded
KC_HTTP_ENABLED=true
```

NGINX forwards the following headers:

- Host
- X-Forwarded-Host
- X-Forwarded-Proto
- X-Forwarded-Port
- X-Forwarded-For
- X-Real-IP

These headers allow Keycloak to correctly generate external URLs while remaining unaware of the internal Docker network.

---

## Jenkins

```text
ci.adrianmorillo.com
```

Routes to:

```text
jenkins:8080
```

Jenkins is accessible only through NGINX and HTTPS.

---

# HTTPS Strategy

HTTPS is provided through Let's Encrypt certificates installed on the VPS.

Certificates are terminated by NGINX before requests are forwarded to internal services.

Current HTTPS endpoints:

```text
https://adrianmorillo.com
https://specpilot.adrianmorillo.com
https://api.specpilot.adrianmorillo.com
https://auth.adrianmorillo.com
https://ci.adrianmorillo.com
```

All HTTP requests are automatically redirected to HTTPS.

---

# Security Model

Only NGINX is exposed publicly.

Application containers remain hidden inside the Docker networks.

Benefits include:

- Service isolation
- TLS termination
- Consistent security headers
- Centralized routing
- Simplified certificate management

The backend, database and authentication services never communicate directly with Internet clients.

---

# Validation

Validate frontend:

```bash
curl -I https://specpilot.adrianmorillo.com
```

Validate backend:

```bash
curl https://api.specpilot.adrianmorillo.com/health
```

Validate Keycloak:

```bash
curl -I https://auth.adrianmorillo.com
```

Validate Jenkins:

```bash
curl -I https://ci.adrianmorillo.com
```

---

# Production Request Flow

Every public request follows the same routing model:

```text
Internet
      │
      ▼
NGINX Reverse Proxy
      │
      ▼
Target Docker Service
```

Internal services communicate exclusively through Docker networks.

---

# Future Improvements

Potential future enhancements include:

- Rate limiting
- Gzip/Brotli compression
- Web Application Firewall (WAF)
- Additional portfolio applications
- Additional backend APIs
- Request monitoring
- Access logging improvements
