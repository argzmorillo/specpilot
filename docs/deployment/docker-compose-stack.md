# Docker Compose Production Stack

## Overview

SpecPilot provides a production-oriented Docker Compose stack for running the private beta platform services together.

The stack defines:

- SpecPilot frontend
- SpecPilot backend API
- PostgreSQL
- Keycloak
- Docker networks
- Persistent volumes

---

## Services

### specpilot-frontend

Angular production build served through Nginx.

Exposed locally on:

```text
http://localhost:4200
```

### specpilot-api

NestJS backend API.

Exposed locally on:

```text
http://localhost:3000
```

The API connects internally to PostgreSQL through the Docker network.

### postgres

PostgreSQL database used by the backend for persistence.

This service is internal and is not exposed publicly.

Data is persisted through the `specpilot_postgres_data` Docker volume.

### keycloak

Keycloak Identity Provider used for local stack authentication testing.

Exposed locally on:

```text
http://localhost:8080
```

---

## Networks

The stack defines two Docker networks.

### specpilot-public

Used by services that need to be reachable by public-facing components.

### specpilot-private

Internal network used for backend-to-database and backend-to-internal-service communication.

PostgreSQL is attached only to the private network.

---

## Volumes

### specpilot_postgres_data

Stores PostgreSQL data.

This allows database data to survive container restarts and image rebuilds.

---

## Environment Variables

The stack expects a local `.env.production` file based on:

```text
.env.production.example
```

Production secrets must not be committed to Git.

---

## Start Stack

From the repository root:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## Stop Stack

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production down
```

---

## Validate Services

Frontend:

```text
http://localhost:4200
```

Backend:

```text
http://localhost:3000
```

Keycloak:

```text
http://localhost:8080
```

---

## Production Notes

This stack provides the service topology and internal networking foundation for the private beta environment.

Future issues will harden the stack with:

- Reverse proxy routing
- HTTPS
- Production Keycloak configuration
- Jenkins deployment automation
- Backup strategy
