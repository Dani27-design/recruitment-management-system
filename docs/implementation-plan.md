# Recruitment Management System

## Implementation Plan

**Version:** 1.0
**Status:** Final
**Development Strategy:** Phase-Based Vertical Slice Development

---

# 1. Purpose

This document defines the implementation roadmap for the Recruitment Management System (RMS).

The project adopts a **phase-based vertical slice approach**, where each phase delivers a complete, independently testable business capability across the entire application stack, including database, backend, frontend, infrastructure, and testing.

Each phase must reach production-quality before the next phase begins.

---

# 2. Development Principles

## 2.1 Vertical Slice Development

Every phase must implement the complete feature end-to-end.

Each phase includes:

* Database design
* Database migration
* Backend implementation
* Frontend implementation
* API integration
* Validation
* Error handling
* Manual testing
* Bug fixing
* Git commit

A phase is not considered complete until the feature is fully functional.

---

## 2.2 Business-First Development

Business capabilities take priority over UI polish or secondary features.

Core recruitment functionality must always be completed before supporting functionality.

---

## 2.3 Incremental Validation

Every completed phase must be independently executable and testable.

No phase should depend on unfinished future work.

---

## 2.4 Layered Architecture

Every feature must follow the same architecture.

```text
Presentation Layer
        │
Controller Layer
        │
Service Layer
        │
Repository Layer
        │
Prisma ORM
        │
PostgreSQL
```

Business rules belong exclusively inside the Service Layer.

---

## 2.5 Coding Standards

Every implementation should follow these principles:

* Single Responsibility Principle (SRP)
* Dependency Injection where applicable
* Clear separation between Domain and Infrastructure
* Consistent naming conventions
* Reusable components
* Consistent API response format
* Centralized exception handling

---

# 3. Repository Structure

The project uses a monorepo managed with npm Workspaces.

```text
recruitment-management-system/
│
├── apps/
│   ├── frontend/
│   └── backend/
│
├── docs/
│   ├── PRD.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── ERD.md
│   └── AI_USAGE_REPORT.md
│
├── package.json
├── README.md
└── .gitignore
```

---

# 4. Phase Development Workflow

Every phase follows the same execution order.

1. Database Migration
2. Repository Implementation
3. Service Implementation
4. Controller Implementation
5. Route Registration
6. Request Validation
7. Frontend UI
8. API Integration
9. Manual Testing
10. Bug Fixing
11. Documentation Update
12. Git Commit

---

# 5. Development Phases

---

# Phase 1 — Project Foundation & Authentication

**Phase Status:** Completed

## Objective

Establish the project foundation, application architecture, authentication system, and deployment-ready environment.

---

## Backend

### Project Initialization

* Initialize Node.js project
* Configure TypeScript
* Configure npm Workspaces
* Configure Express
* Configure ESLint
* Configure Prettier
* Configure environment variables
* Configure application entry point
* Configure application bootstrap

### Install Dependencies

Install:

* Express
* Prisma
* PostgreSQL Driver
* Zod
* JWT
* bcrypt
* Multer
* dotenv
* CORS
* Morgan
* Supabase SDK

### Folder Structure

Create:

```text
src/
├── config/
├── constants/
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── validations/
├── utils/
├── types/
├── prisma/
├── app.ts
└── server.ts
```

### Database

Configure Prisma

Create:

* User model

Create initial migration.

Create seed script.

Seed:

* Administrator account
* Manager account

### Authentication

Implement:

* Login API
* JWT generation
* Password hashing
* Password verification
* Authentication middleware
* Authorization middleware

### Error Handling

Implement:

* Global error handler
* API response formatter
* Exception classes

---

## Frontend

### Project Initialization

Create React application using Vite.

Install:

* React Router
* React Query
* Axios
* React Hook Form
* Tailwind CSS

### Folder Structure

```text
src/
├── api/
├── assets/
├── components/
├── features/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── types/
└── utils/
```

### Authentication UI

Implement:

* Login page
* Authentication provider
* Protected routes
* Logout
* Axios interceptor
* Token persistence

---

## Testing Checklist

* Login succeeds
* Invalid credentials rejected
* JWT generated correctly
* Protected routes enforced
* Logout succeeds

---

## Deliverables

* Project structure established
* Authentication operational
* Protected application
* Deployment-ready foundation

---

# Phase 2 — Candidate Management

**Phase Status:** Completed

## Objective

Implement complete candidate administration.

---

## Database

Create Candidate model.

Generate migration.

---

## Backend

### Repository

Implement:

* Create candidate
* Update candidate
* Delete candidate
* Get candidate
* List candidates
* Search candidates

### Service

Business Rules:

* Email uniqueness
* Phone validation

### Controller

Implement:

* Candidate CRUD APIs
* Search API

### Validation

Create:

* CandidateCreateSchema
* CandidateUpdateSchema

---

## Frontend

Pages

* Candidate List
* Candidate Detail
* Create Candidate
* Edit Candidate

Components

* Candidate Table
* Candidate Form
* Search Bar
* Delete Confirmation Dialog

---

## Testing Checklist

* Candidate CRUD
* Search
* Validation
* Error handling

---

## Deliverables

Complete Candidate Management module.

---

# Phase 3 — Vacancy Management

**Phase Status:** Completed

## Objective

Implement vacancy administration.

---

## Database

Create Vacancy model.

Generate migration.

---

## Backend

### Repository

Implement:

* Create vacancy
* Update vacancy
* Delete vacancy
* Get vacancy
* List vacancies

### Service

Business Rules:

* Hiring needed validation
* Active/Inactive validation

### Controller

Implement Vacancy CRUD APIs.

### Validation

Create Vacancy schemas.

---

## Frontend

Pages

* Vacancy List
* Create Vacancy
* Edit Vacancy

Components

* Vacancy Table
* Vacancy Form

---

## Testing Checklist

* CRUD
* Validation
* Status updates

---

## Deliverables

Complete Vacancy Management module.

---

# Phase 4 — Recruitment Core

**Phase Status:** Completed

## Objective

Implement the Recruitment aggregate root.

---

## Database

Create Recruitment model.

Generate migration.

---

## Backend

### Repository

Implement:

* Create recruitment
* Get recruitment
* List recruitments

### Service

Business Rules:

* Candidate must exist
* Vacancy must exist
* Vacancy must be ACTIVE

Automatically create:

* APPLIED stage
* Status = PENDING

### Controller

Implement:

* Recruitment List
* Recruitment Detail
* Recruitment Creation

---

## Frontend

Pages

* Recruitment List
* Recruitment Detail
* Create Recruitment

Components

* Candidate Selector
* Vacancy Selector

---

## Testing Checklist

* Recruitment creation
* Validation
* Initial stage creation

---

## Deliverables

Recruitment aggregate root completed.

---

# Phase 5 — Recruitment Workflow Engine

**Phase Status:** Completed

## Objective

Implement the stage-driven recruitment workflow.

---

## Database

Create RecruitmentStage model.

Generate migration.

---

## Backend

### Repository

Implement:

* Create stage
* Get stage
* List stages
* Update stage

### Service

Implement workflow engine.

Business Rules

* One active stage
* Sequential progression
* Immutable completed stages
* Reject terminates recruitment
* Pass creates next stage
* Acceptance completes workflow

### Controller

Implement:

* Stage timeline
* Update stage status

---

## Frontend

Pages

* Recruitment Timeline

Components

* Timeline
* Stage Card
* Status Badge
* Stage Notes

---

## Testing Checklist

* Pass flow
* Reject flow
* Sequential validation
* Immutable stages
* Timeline rendering

---

## Deliverables

Recruitment workflow engine completed.

---

# Phase 6 — Stage Assignment & Authorization

**Phase Status:** Completed

## Objective

Implement manager assignment and authorization rules.

---

## Backend

### Repository

Implement assignment update.

### Service

Business Rules

* Assign manager
* Only assigned manager may update stage
* Administrator override

### Middleware

Role authorization.

Ownership validation.

---

## Frontend

Components

* Manager Selector
* Assigned Manager Badge

Pages

* Stage Assignment

---

## Testing Checklist

* Assignment
* Unauthorized updates
* Administrator override

---

## Deliverables

Stage ownership fully enforced.

---

# Phase 7 — Recruitment Documents

**Phase Status:** Completed

## Objective

Implement recruitment document management.

---

## Database

Create RecruitmentDocument model.

Generate migration.

---

## Infrastructure

Configure Supabase Storage.

Create storage bucket.

---

## Backend

### Repository

Implement:

* Save metadata
* List documents
* Soft delete metadata

### Service

Implement:

* Upload
* Download
* Soft delete

Business Rules

* Supported document types:

  * CV
  * PORTFOLIO
* MIME validation
* File size validation
* Storage consistency validation

### Controller

Implement:

* Administrator-only upload endpoint
* Administrator and Manager document list endpoint
* Administrator and Manager download endpoint
* Administrator-only soft delete endpoint

---

## Frontend

Pages

* Recruitment Documents

Components

* Upload Dialog
* Document Table
* Download Button
* Delete Button

Role-based UI behavior:

* Administrators may upload, download, and delete recruitment documents.
* Managers may view and download recruitment documents only.

---

## Testing Checklist

* Administrator upload
* Manager upload rejection
* Download
* Administrator soft delete
* Manager view/download-only behavior
* Invalid file
* Invalid document type

---

## Deliverables

Recruitment document management completed.

---

# Phase 8 — Dashboard

**Phase Status:** Completed

## Objective

Provide recruitment summary information.

---

## Backend

Implement aggregation queries.

Calculate:

* Total Candidates
* Total Recruitments
* Total Active Vacancies
* Recruitment Count by Current Stage
* Recruitment Count by Current Status

---

## Frontend

Pages

* Dashboard

Components

* Statistic Cards
* Summary Panels

---

## Testing Checklist

* Aggregation accuracy
* Empty state
* Loading state

---

## Deliverables

Dashboard completed.

---

# Phase 9 — Audit Logging

**Phase Status:** Completed

## Objective

Provide complete system traceability.

---

## Database

Create AuditLog model.

Generate migration.

---

## Backend

Implement Audit Service.

Automatically record:

* CREATE
* UPDATE
* DELETE

Store:

* Actor
* Entity
* Event Type
* Changed Fields
* Timestamp

Integrate audit logging into all write operations.

---

## Frontend

Pages

* Audit Log

Components

* Audit Table
* Entity Filter
* Event Filter

---

## Testing Checklist

* CRUD operations generate audit logs
* Change tracking accuracy
* Filtering

---

## Deliverables

Audit logging completed.

---

# Phase 10 — Production Readiness

**Phase Status:** Local readiness completed; public deployment verification pending external platform access.

## Objective

Prepare the application for final delivery.

---

## Backend

* Code refactoring
* Remove dead code
* API consistency review
* Validation review
* Error handling review
* Performance review

---

## Frontend

* Responsive validation
* UI consistency review
* Professional internal dashboard layout
* Responsive full-width application shell with mobile drawer navigation
* Compact dashboard density across mobile, tablet, and desktop
* Shared table, card, button, form, and alert styling
* Role-aware document action presentation
* Loading states
* Empty states
* Error states
* Accessibility review

---

## Infrastructure

### Supabase

* Configure PostgreSQL
* Configure Storage
* Verify environment variables

### Render

Deploy backend.

Verify:

* Environment variables
* Health check
* CORS
* Production build

### Vercel

Deploy frontend.

Verify:

* Production build
* API connectivity
* Route rewrites
* Environment variables

---

## Documentation

Complete and review:

* README.md
* PRD.md
* IMPLEMENTATION_PLAN.md
* ERD.md
* AI_USAGE_REPORT.md

Additional local readiness notes are captured in `docs/production-readiness.md`.

---

## Final Testing Checklist

### Authentication

* Login
* Logout
* JWT validation
* Authorization

### Candidate

* CRUD
* Search
* Validation

### Vacancy

* CRUD
* Validation

### Recruitment

* Create
* View
* Validation

### Workflow

* Sequential progression
* Pass
* Reject
* Assignment
* Authorization

### Documents

* Upload
* Download
* Delete

### Dashboard

* Statistics accuracy

### Audit Logging

* Event generation
* Change tracking
* Filtering

---

## Deliverables

* Production-ready application
* Public deployment
* Complete documentation
* Technical assessment ready

---

# 6. Git Commit Strategy

Each completed phase should be committed independently.

Recommended commit sequence:

```text
phase-1-project-foundation
phase-2-candidate-management
phase-3-vacancy-management
phase-4-recruitment-core
phase-5-recruitment-workflow
phase-6-stage-assignment
phase-7-recruitment-documents
phase-8-dashboard
phase-9-audit-logging
phase-10-production-readiness
```

---

# 7. Definition of Done

A phase is considered complete only when all of the following conditions are satisfied:

* Database migration is completed.
* Backend implementation is completed.
* Frontend implementation is completed.
* Validation rules are implemented.
* Error handling is implemented.
* Manual testing passes.
* Business rules defined in the PRD are satisfied.
* Documentation is updated if required.
* Source code is committed.
* No known blocking defects remain.

---

# 8. Project Completion Criteria

The project is considered complete when:

* Every phase has been successfully delivered.
* All mandatory functional requirements defined in the PRD have been implemented.
* Authentication and RBAC are fully operational.
* Recruitment workflow complies with all defined business rules.
* Recruitment documents are successfully managed using Supabase Storage.
* Audit logging captures every successful CREATE, UPDATE, and DELETE operation.
* Dashboard statistics accurately reflect application data.
* Frontend is publicly accessible through Vercel.
* Backend is publicly accessible through Render.
* Database and object storage are operational on Supabase.
* Documentation is complete, accurate, and sufficient for reviewers to install, understand, execute, and evaluate the application.
