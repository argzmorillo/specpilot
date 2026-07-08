# Access Request Domain Model

## Overview

The Access Request domain model supports the private beta onboarding workflow.

It stores and manages requests submitted by authenticated users who want access to protected applications within the ecosystem before application-specific permissions are granted.

The model is application-aware and has been designed to support future ecosystem expansion beyond SpecPilot.

---

## Purpose

Authentication and application access are intentionally separated.

Keycloak is responsible for:

- User authentication
- Identity management
- Session management
- Global role assignment

The SpecPilot backend is responsible for:

- Tracking application access requests
- Managing request lifecycle
- Controlling onboarding workflow
- Recording administrative decisions

This separation keeps authentication independent from business-specific access management.

---

# AccessRequest Entity

The `AccessRequest` entity represents a single request for access to an application.

Each request belongs to:

- One authenticated Keycloak user
- One target application

Current supported application:

```text
SPECPILOT
```

The design intentionally supports multiple applications in the future.

---

# Request Lifecycle

## PENDING

The request has been submitted successfully and is awaiting administrator review.

Users in this state:

- Can authenticate through Keycloak
- Cannot access the protected application
- See a "Pending Approval" screen inside the application

---

## APPROVED

The request has been approved by an administrator.

Once approved:

- The request status becomes `APPROVED`
- The administrator grants the required application role in Keycloak
- The user gains access to the application

---

## REJECTED

The request has been rejected.

Rejected requests remain stored for auditing purposes.

Future versions may allow administrators to include rejection reasons or permit resubmission.

---

# Uniqueness Rules

Each authenticated user may submit only one request per application.

This constraint is enforced through the database.

Unique key:

```text
(keycloakUserId, requestedApplication)
```

This prevents duplicate requests while allowing future support for multiple applications.

---

# Validation Rules

The AccessRequest model follows the following validation rules:

- Every request belongs to an authenticated Keycloak user.
- Every request targets exactly one application.
- A user may only submit one request per application.
- Every new request starts with the `PENDING` status.
- Approval metadata is stored when a request is reviewed.
- Rejected requests remain available for auditing purposes.

---

# Stored Information

Each request stores:

- Keycloak user identifier
- User email
- User full name
- Requested application
- Current request status
- Optional user message
- Optional administrator notes
- Review timestamp
- Reviewing administrator
- Creation timestamp
- Last update timestamp

---

# Future Evolution

The current model has been intentionally designed to support future onboarding features, including:

- Administrator approval panel
- Email notifications
- Automatic Keycloak role assignment
- Multiple protected applications
- Request history
- Approval auditing
- Internal administration dashboard

---

# Workflow Overview

```text
User Login (Keycloak)
        │
        ▼
No Application Role
        │
        ▼
Access Request Created
        │
        ▼
Status = PENDING
        │
        ▼
Administrator Review
        │
   ┌────┴────┐
   ▼         ▼

APPROVED  REJECTED
   │
   ▼
Assign Keycloak Role
   │
   ▼
Application Access Granted
```
