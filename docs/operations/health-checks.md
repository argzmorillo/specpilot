# Health Checks

## Overview

SpecPilot provides a health endpoint to verify application availability after deployment.

The endpoint validates:

- NestJS application startup
- Prisma connectivity
- PostgreSQL connectivity

---

## Endpoint

```text
GET /health
```

---

## Successful Response

```json
{
  "status": "ok",
  "database": "up"
}
```

---

## Failure Response

```json
{
  "status": "error",
  "database": "down"
}
```

HTTP Status:

```text
503 Service Unavailable
```

---

## Deployment Verification

Validate a deployment using:

```bash
curl http://localhost:3000/health
```

Expected result:

```json
{
  "status": "ok",
  "database": "up"
}
```

A successful response confirms:

- Application startup completed
- Database connectivity is operational
- Deployment is healthy
