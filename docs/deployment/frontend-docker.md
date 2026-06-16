# Frontend Docker Image

## Overview

The SpecPilot frontend can be built and served as a production-ready Docker image.

The image contains:

- The Angular production build
- A lightweight Nginx static web server
- SPA routing support

Runtime traffic is served by Nginx.

---

## Build Image

From the repository root:

```bash
docker build -f frontend/Dockerfile -t specpilot-frontend:local .
```

---

## Run Image

From the repository root:

```bash
docker run --rm -p 4200:80 specpilot-frontend:local
```

The frontend will be available at:

```text
http://localhost:4200
```

---

## Angular Production Build

The frontend image builds the Angular application using the production build pipeline.

The compiled static files are copied into the Nginx container.

---

## SPA Routing

Angular uses client-side routing.

The Nginx configuration redirects unknown routes to:

```text
/index.html
```

This allows browser refreshes on application routes to work correctly.

---

## Production Configuration

Production frontend configuration is currently compiled through Angular environment files.

The production API target is configured in:

```text
frontend/src/environments/environment.prod.ts
```

For the private beta environment, the frontend should target:

```text
https://specpilot-api.adrianmorillo.com
```

Future runtime configuration may be introduced if the ecosystem requires changing frontend configuration without rebuilding the image.

---

## Production Notes

The frontend image is designed to be deployed behind a reverse proxy.

In the private beta environment, public traffic will reach the frontend through:

```text
https://specpilot.adrianmorillo.com
```

The container itself serves static files over port 80 and should be exposed publicly only through the platform reverse proxy.
