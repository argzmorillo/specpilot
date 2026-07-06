# Jenkins Deployment

## Overview

SpecPilot uses Jenkins as the central CI/CD orchestration service for deployment automation, build validation and future infrastructure workflows.

Jenkins is deployed as an independent service inside the production Docker Compose stack and is exposed securely through the NGINX reverse proxy using HTTPS.

The current deployment pipeline provides reproducible production deployments while establishing the foundation for future GitHub webhook automation.

---

## Deployment Architecture

Current deployment:

```text
Internet
        │
        ▼
NGINX Reverse Proxy
        │
        ▼
Jenkins
        │
        ▼
Docker Engine
        │
        ▼
SpecPilot Infrastructure
```

Jenkins does not expose ports directly to the public Internet.

All public traffic is routed through NGINX.

---

## Docker Configuration

Jenkins is deployed using a custom Docker image based on the official Jenkins LTS image.

Base image:

```text
jenkins/jenkins:lts-jdk21
```

The custom image additionally provides:

- Docker CLI
- Docker Compose
- Git
- Required deployment tooling

Persistent data is stored inside:

```text
/var/jenkins_home
```

through the Docker volume:

```text
specpilot_jenkins_data
```

This ensures Jenkins configuration, plugins, users, credentials and pipeline history survive container recreation.

---

## Reverse Proxy

Jenkins is available through:

```text
https://ci.adrianmorillo.com
```

NGINX terminates HTTPS and forwards traffic to the internal Jenkins service.

Public HTTP requests are automatically redirected to HTTPS.

---

## Docker Integration

Jenkins has access to the Docker Engine through the mounted Docker socket:

```text
/var/run/docker.sock
```

This allows Jenkins pipelines to:

- Build Docker images
- Recreate production containers
- Execute Docker Compose commands
- Deploy updated services
- Execute operational automation

The Docker socket is intentionally shared with Jenkins to allow full container lifecycle management from pipeline executions.

---

## Repository Access

The production repository is mounted inside the Jenkins container:

```text
/opt/ecosystem/specpilot
```

Deployment jobs operate directly on the production working copy, allowing reproducible deployments without cloning the repository during every pipeline execution.

---

## Current Deployment Pipeline

The current deployment pipeline supports both image validation and controlled production deployments.

Current pipeline stages:

- Workspace validation
- Docker image build
- Optional production deployment
- Production container recreation
- Prisma database migrations
- Deployment health check validation

This workflow minimizes manual intervention while ensuring production deployments remain reproducible and safe.

---

## Deployment Modes

The deployment pipeline currently supports two execution modes.

### Validation Build

Builds the production Docker images without modifying the running production environment.

Used for:

- Build validation
- Infrastructure verification
- Docker image testing

---

### Production Deployment

Production deployment is controlled through the Jenkins parameter:

```text
DEPLOY_TO_PRODUCTION
```

When enabled, Jenkins performs the complete deployment workflow:

- Updates the production repository
- Builds Docker images
- Recreates production containers
- Executes Prisma database migrations
- Validates deployment health

This manual trigger provides a controlled deployment process while preparing the infrastructure for future GitHub webhook automation.

---

## Persistence

Persistent Jenkins data includes:

- Configuration
- Installed plugins
- Users
- Credentials
- Build history
- Pipeline definitions

Container recreation does not remove Jenkins data.

---

## Initial Administration

The initial administrator password can be obtained with:

```bash
docker exec specpilot-jenkins \
cat /var/jenkins_home/secrets/initialAdminPassword
```

The password is only required during the first initialization.

Once Jenkins is configured, administrative users are managed directly through the Jenkins interface.

---

## Networking

Jenkins belongs to both Docker networks:

- specpilot-public
- specpilot-private

This allows Jenkins to:

- Communicate with infrastructure services
- Manage Docker containers
- Deploy application services

while keeping internal services isolated from direct Internet access.

---

## Validation

Deployment validation includes:

- Successful Jenkins pipeline execution
- Successful Docker image builds
- Successful container recreation
- Successful Prisma migrations
- Backend health endpoint validation
- Frontend availability
- Jenkins availability
- Keycloak availability

Useful validation commands:

Validate running containers:

```bash
docker ps
```

Validate Jenkins logs:

```bash
docker logs specpilot-jenkins
```

Validate Jenkins availability:

```bash
curl -I https://ci.adrianmorillo.com
```

---

## Related Files

```text
Jenkinsfile
docker-compose.prod.yml
infrastructure/nginx/nginx.conf
```
