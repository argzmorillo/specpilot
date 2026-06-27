# Production HTTPS and DNS

## Overview

SpecPilot uses public DNS records, NGINX reverse proxy routing and Let's Encrypt certificates to expose the private beta platform through secure HTTPS endpoints.

This configuration enables public access to the platform services while keeping internal services isolated behind the reverse proxy.

---

## Public Domain Strategy

The production domain strategy is based on the `adrianmorillo.com` root domain.

Current public routes:

| Domain                            | Purpose                 | Status      |
| --------------------------------- | ----------------------- | ----------- |
| `adrianmorillo.com`               | Portfolio root domain   | Placeholder |
| `specpilot.adrianmorillo.com`     | SpecPilot frontend      | Active      |
| `api.specpilot.adrianmorillo.com` | SpecPilot backend API   | Active      |
| `auth.adrianmorillo.com`          | Keycloak authentication | Active      |
| `ci.adrianmorillo.com`            | Jenkins CI/CD           | Deferred    |

---

## DNS Configuration

All public platform domains are configured as `A` records pointing to the production VPS public IP.

Current VPS IP:

```text
82.223.165.248
```

DNS records:

```text
adrianmorillo.com                  -> 82.223.165.248
specpilot.adrianmorillo.com        -> 82.223.165.248
api.specpilot.adrianmorillo.com    -> 82.223.165.248
auth.adrianmorillo.com             -> 82.223.165.248
ci.adrianmorillo.com               -> 82.223.165.248
```

Mail-related DNS records such as MX, SPF, DKIM and DMARC are preserved and are not managed by the application deployment stack.

---

## HTTPS Certificate Strategy

HTTPS certificates are generated using Let's Encrypt through Certbot.

The current certificate covers:

```text
adrianmorillo.com
specpilot.adrianmorillo.com
api.specpilot.adrianmorillo.com
auth.adrianmorillo.com
```

Jenkins HTTPS will be completed when the Jenkins service is deployed.

---

## Certificate Location

Certificates are stored on the VPS under:

```text
/etc/letsencrypt/live/adrianmorillo.com/
```

NGINX uses:

```text
/etc/letsencrypt/live/adrianmorillo.com/fullchain.pem
/etc/letsencrypt/live/adrianmorillo.com/privkey.pem
```

The `/etc/letsencrypt` directory is mounted read-only into the NGINX container.

---

## Certbot Webroot Strategy

Certificate renewal uses the Certbot webroot strategy.

The webroot directory is:

```text
/opt/infrastructure/certbot/www
```

This directory is mounted into the NGINX container as:

```text
/var/www/certbot
```

NGINX serves Let's Encrypt HTTP challenges from:

```text
/.well-known/acme-challenge/
```

This allows Certbot to renew certificates without stopping NGINX.

---

## NGINX HTTPS Routing

NGINX acts as the public reverse proxy.

Responsibilities:

- Receive public HTTP/HTTPS traffic
- Redirect HTTP traffic to HTTPS
- Serve Let's Encrypt HTTP challenges
- Terminate HTTPS
- Route traffic to internal Docker services

Internal routing:

```text
specpilot.adrianmorillo.com      -> specpilot-frontend:80
api.specpilot.adrianmorillo.com  -> specpilot-api:3000
auth.adrianmorillo.com           -> keycloak:8080
```

---

## HTTP to HTTPS Redirection

Public HTTP traffic is redirected to HTTPS.

Example:

```text
http://specpilot.adrianmorillo.com
```

redirects to:

```text
https://specpilot.adrianmorillo.com
```

The exception is the Let's Encrypt challenge path, which must remain available over HTTP:

```text
/.well-known/acme-challenge/
```

---

## Validation Commands

### DNS Validation

```bash
nslookup adrianmorillo.com
nslookup specpilot.adrianmorillo.com
nslookup api.specpilot.adrianmorillo.com
nslookup auth.adrianmorillo.com
```

Expected result:

```text
82.223.165.248
```

---

### HTTPS Validation

```bash
curl -I http://specpilot.adrianmorillo.com
curl -I https://specpilot.adrianmorillo.com
curl https://api.specpilot.adrianmorillo.com/health
curl -I https://auth.adrianmorillo.com
```

Expected results:

```text
HTTP -> 301 redirect to HTTPS
Frontend HTTPS -> 200 OK
API health -> {"status":"ok","database":"up"}
Keycloak HTTPS -> 200 OK or 302 redirect
```

---

### Certbot Webroot Validation

Manual challenge validation:

```bash
echo "ok-certbot-test" > /opt/infrastructure/certbot/www/.well-known/acme-challenge/test.txt
```

Public validation:

```bash
curl http://specpilot.adrianmorillo.com/.well-known/acme-challenge/test.txt
```

Expected response:

```text
ok-certbot-test
```

---

### Certificate Renewal Dry Run

```bash
certbot certonly --webroot \
  -w /opt/infrastructure/certbot/www \
  -d adrianmorillo.com \
  -d specpilot.adrianmorillo.com \
  -d api.specpilot.adrianmorillo.com \
  -d auth.adrianmorillo.com \
  --dry-run
```

Expected result:

```text
The dry run was successful.
```

---

## Current Status

Completed:

- DNS records configured
- Public domain routing validated
- Let's Encrypt certificate generated
- HTTPS enabled
- HTTP to HTTPS redirection configured
- SpecPilot frontend accessible through HTTPS
- Backend API accessible through HTTPS
- Keycloak accessible through HTTPS
- Certbot webroot renewal validated

Deferred:

- Jenkins HTTPS access will be completed when Jenkins is deployed.
- Portfolio currently returns a placeholder response until the portfolio frontend is deployed.

---

## Related Infrastructure

Relevant files:

```text
docker-compose.prod.yml
infrastructure/nginx/nginx.conf
```

Relevant VPS directories:

```text
/etc/letsencrypt
/opt/infrastructure/certbot/www
/opt/ecosystem/specpilot
```
