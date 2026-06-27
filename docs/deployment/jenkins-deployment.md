# Jenkins Deployment

## Overview

SpecPilot uses Jenkins as the CI/CD orchestration service for deployment automation, operational workflows and future infrastructure tasks.

Jenkins is deployed as an independent service inside the production Docker Compose stack.

It is exposed publicly through the reverse proxy and secured with HTTPS.

---

## Deployment Architecture

Current deployment:

```text
Internet
        │
        ▼
NGINX
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

Jenkins is deployed using the official LTS image.

Current image:

```text
jenkins/jenkins:lts-jdk21
```

Persistent data is stored inside:

```text
/var/jenkins_home
```

through the Docker volume:

```text
specpilot_jenkins_data
```

This ensures Jenkins configuration, plugins and jobs survive container recreation.

---

## Reverse Proxy

Jenkins is available through:

```text
https://ci.adrianmorillo.com
```

NGINX terminates HTTPS and forwards traffic to the internal Jenkins service.

Public HTTP requests are redirected to HTTPS.

---

## Docker Integration

Jenkins has access to the Docker Engine through the mounted Docker socket:

```text
/var/run/docker.sock
```

This allows Jenkins pipelines to:

- Build Docker images
- Start and stop containers
- Deploy updated services
- Execute operational automation

---

## Repository Access

The project repository is mounted inside the Jenkins container:

```text
/opt/ecosystem/specpilot
```

This allows deployment jobs to interact with the production working copy.

---

## Persistence

Persistent data includes:

- Jenkins configuration
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

---

## Networking

Jenkins belongs to:

- specpilot-public
- specpilot-private

Application services remain isolated while still allowing deployment automation.

---

## Validation

Validate container:

```bash
docker ps
```

Validate logs:

```bash
docker logs specpilot-jenkins
```

Validate public access:

```bash
curl -I https://ci.adrianmorillo.com
```

---

## Related Files

```text
docker-compose.prod.yml
infrastructure/nginx/nginx.conf
```
