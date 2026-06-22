# Backend Docker Image

## Overview

The SpecPilot backend can be built and executed as a production-ready Docker image.

The image contains:

- The compiled NestJS application
- Production Node.js dependencies
- Generated Prisma client
- Prisma schema files required for runtime compatibility

Runtime configuration is provided through environment variables.

---

## Build Image

From the `backend` directory:

```bash
docker build -t specpilot-api:local .
```

---

## Run Image

From the `backend` directory:

```bash
docker run --rm --env-file .env -p 3000:3000 specpilot-api:local
```

The backend will be available at:

```text
http://localhost:3000
```

---

## Prisma

The Prisma client is generated during the Docker build process.

Database migrations are not executed as part of the image build.

Production migrations should be executed during deployment using:

```bash
npx prisma migrate deploy
```

This keeps image creation separated from database schema changes.

---

## Runtime Configuration

The container receives configuration through environment variables.

Required runtime variables are documented in:

```text
docs/environment-configuration.md
```

Important runtime variables include:

```text
NODE_ENV
PORT
DATABASE_URL
OPENAI_API_KEY
OPENAI_MODEL
KEYCLOAK_ISSUER_URL
KEYCLOAK_CLIENT_ID
CORS_ALLOWED_ORIGINS
```

---

## Production Notes

The backend image is designed to be deployed behind a reverse proxy.

In the private beta environment, public traffic will reach the backend through:

```text
https://specpilot-api.adrianmorillo.com
```

The container itself should not be exposed directly to the Internet in production.

It should communicate with PostgreSQL and other internal services through Docker networks.
