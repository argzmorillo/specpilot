# PostgreSQL Persistence

## Overview

SpecPilot uses PostgreSQL as the persistence layer for analysis history, AI output storage and future private beta access management.

In the Docker Compose stack, PostgreSQL runs as an internal service and stores data in a persistent Docker volume.

---

## Service

The PostgreSQL service is defined in:

```text
docker-compose.prod.yml
```

Service name:

```text
postgres
```

Container name:

```text
specpilot-postgres
```

Internal connection host:

```text
postgres
```

The backend connects to PostgreSQL using the Docker Compose service name instead of `localhost`.

---

## Runtime Configuration

The database connection is configured through:

```text
DATABASE_URL
```

Example:

```text
postgresql://specpilot:change-me@postgres:5432/specpilot?schema=public
```

Required PostgreSQL variables:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
DATABASE_URL
```

Production secrets must not be committed to Git.

---

## Persistent Volume

PostgreSQL data is stored in the Docker volume:

```text
specpilot_postgres_data
```

This allows database data to survive:

- Container restarts
- Image rebuilds
- Docker Compose stop/start cycles

Data is removed only if the volume is explicitly deleted.

---

## Run Migrations

Prisma migrations should be executed against the running backend container:

```bash
docker exec -it specpilot-api npx prisma migrate deploy
```

Migration status can be checked with:

```bash
docker exec -it specpilot-api npx prisma migrate status
```

---

## Inspect Tables

PostgreSQL tables can be inspected with:

```bash
docker exec -it specpilot-postgres psql -U specpilot -d specpilot -c "\dt"
```

---

## Persistence Validation

To validate that data survives restarts:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production down
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

Then inspect the database again:

```bash
docker exec -it specpilot-postgres psql -U specpilot -d specpilot -c "\dt"
```

The existing tables and data should still be available.

Do not use `down -v` unless the intention is to remove persistent data.

---

## Production Notes

PostgreSQL is not exposed publicly.

It is attached only to the private Docker network and should be accessed by backend services through internal Docker networking.

Future production improvements may include:

- Automated backups
- Restore procedures
- Backup retention policy
- Monitoring and alerting
