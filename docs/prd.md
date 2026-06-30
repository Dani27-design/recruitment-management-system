# Recruitment Management System

## Product Requirements Document (PRD)

**Version:** 1.0
**Status:** Final
**Document Owner:** Development Team
**Project Type:** Internal Recruitment Management System

---

# 1. Introduction

## 1.1 Purpose

The Recruitment Management System (RMS) is an internal web application designed to support Human Resources (HR) teams in managing recruitment activities throughout the hiring lifecycle.

The system centralizes candidate management, vacancy management, recruitment workflow execution, recruitment document management, and recruitment history into a single platform.

This document defines the product requirements, business rules, architecture boundaries, functional specifications, and implementation constraints for the Recruitment Management System.

---

## 1.2 Objectives

The system aims to:

* Centralize recruitment management.
* Standardize recruitment workflow execution.
* Maintain candidate information.
* Manage job vacancies.
* Track recruitment progress through predefined workflow stages.
* Store recruitment-related documents.
* Maintain complete audit history.
* Provide operational recruitment statistics.
* Ensure maintainable and scalable software architecture.

---

## 1.3 Target Users

The system is intended exclusively for internal company users.

Supported users:

* Administrator (HR)
* Manager (Interviewer)

The application is **not** intended to function as a public job portal.

---

# 2. Project Scope

## 2.1 In Scope

The following features are included:

* Authentication
* Role-Based Access Control (RBAC)
* Candidate Management
* Vacancy Management
* Recruitment Management
* Stage-Based Recruitment Workflow
* Recruitment Document Management
* Dashboard
* Audit Logging

---

## 2.2 Out of Scope

The following features are intentionally excluded:

* Public job portal
* Candidate self-registration
* Candidate login
* Email notifications
* SMS notifications
* Resume parsing
* Calendar integration
* AI-assisted recruitment
* Workflow customization
* Real-time collaboration
* Multi-company support

---

# 3. User Roles

The application implements Role-Based Access Control (RBAC).

Only authenticated users may access the system.

---

## 3.1 Administrator

Administrator represents Human Resources personnel responsible for managing recruitment activities.

### Responsibilities

* Manage candidates
* Manage vacancies
* Create recruitments
* Assign managers to recruitment stages
* Control recruitment workflow
* Upload recruitment documents
* View dashboard
* View audit logs

Administrator has unrestricted access to all business operations.

---

## 3.2 Manager

Manager represents interviewers or recruitment evaluators.

### Responsibilities

* View assigned recruitments
* Review candidate information
* Review vacancy information
* Update assigned recruitment stages
* Upload recruitment documents
* Add stage notes
* View dashboard

Managers may only modify recruitment stages assigned to themselves.

---

# 4. Authentication

Authentication is implemented using JSON Web Token (JWT).

The system provides:

* Login
* Logout
* Protected API access

All protected endpoints require a valid JWT access token.

Password hashing must use bcrypt.

---

# 5. Domain Model

The system consists of seven primary business entities.

---

## 5.1 User

Represents authenticated system users.

### Fields

* id
* email
* password_hash
* role
* created_at
* updated_at

### Relationships

* One User may create many Recruitments.
* One User may be assigned to many Recruitment Stages.
* One User may upload many Recruitment Documents.
* One User may generate many Audit Logs.

---

## 5.2 Candidate

Represents an applicant.

Candidate information is independent of any recruitment process.

### Fields

* id
* full_name
* email
* phone_number
* created_at
* updated_at

### Relationships

* One Candidate may have many Recruitments.

---

## 5.3 Vacancy

Represents a job opening.

### Fields

* id
* position_name
* department
* hiring_needed
* status
* created_at
* updated_at

### Status

* ACTIVE
* INACTIVE

### Relationships

* One Vacancy may have many Recruitments.

---

## 5.4 Recruitment

Recruitment is the Aggregate Root of the recruitment domain.

A recruitment represents a candidate applying for one vacancy.

### Fields

* id
* candidate_id
* vacancy_id
* created_by
* created_at
* updated_at

### Relationships

* Belongs to one Candidate.
* Belongs to one Vacancy.
* Created by one User.
* Owns many Recruitment Stages.
* Owns many Recruitment Documents.

---

## 5.5 Recruitment Stage

Represents one step within the recruitment workflow.

Stages are immutable once completed.

Only one stage may remain active at any given time.

### Fields

* id
* recruitment_id
* stage
* status
* assigned_user_id
* scheduled_at
* completed_at
* notes
* created_at
* updated_at

### Stage Enumeration

* APPLIED
* SCREENING
* TECHNICAL_TEST
* INTERVIEW
* ACCEPTANCE

### Status Enumeration

* PENDING
* PASSED
* REJECTED

### Relationships

* Belongs to one Recruitment.
* Assigned to one User.

---

## 5.6 Recruitment Document

Represents supporting documents attached to a recruitment.

Documents belong to the recruitment rather than the candidate.

### Fields

* id
* recruitment_id
* document_type
* original_filename
* stored_filename
* mime_type
* file_size
* storage_provider
* storage_path
* uploaded_by
* created_at
* updated_at

### Supported Document Types

* CV
* PORTFOLIO

### Relationships

* Belongs to one Recruitment.
* Uploaded by one User.

---

## 5.7 Audit Log

Stores immutable system activity history.

Audit logs exist solely for traceability.

### Fields

* id
* entity_type
* entity_id
* event_type
* actor_id
* changes (JSON)
* created_at

### Supported Event Types

* CREATE
* UPDATE
* DELETE

### Relationships

* Generated by one User.

---

# 6. Recruitment Workflow

The recruitment workflow is strictly stage-driven.

Stages cannot be skipped.

Stages cannot be reordered.

Only one stage may remain active.

---

## Workflow Sequence

1. APPLIED
2. SCREENING
3. TECHNICAL_TEST
4. INTERVIEW
5. ACCEPTANCE

---

## Stage Status

Every stage uses the same standardized status values.

* PENDING
* PASSED
* REJECTED

---

## Business Rules

### Rule 1

Creating a recruitment automatically creates the first stage:

* APPLIED
* Status = PENDING

---

### Rule 2

Only one stage may have status **PENDING** at any time.

---

### Rule 3

A stage must be completed before the next stage is created.

---

### Rule 4

Stages are processed sequentially.

Stage skipping is prohibited.

---

### Rule 5

Completed stages become immutable.

Neither status nor notes may be modified after completion.

---

### Rule 6

If a stage is marked **PASSED**, the next workflow stage is automatically created with status **PENDING**, unless the completed stage is ACCEPTANCE.

---

### Rule 7

If a stage is marked **REJECTED**, the recruitment immediately terminates.

No additional stages may be created.

---

### Rule 8

Only the assigned manager or an administrator may update a recruitment stage.

---

### Rule 9

A manager may only update stages assigned to themselves.

---

# 7. Recruitment Documents

Recruitment documents represent supporting files attached to a recruitment.

Current supported document types:

* CV
* PORTFOLIO

Files are stored in Supabase Storage.

Only metadata is stored in PostgreSQL.

### Business Rules

* A recruitment may contain multiple documents.
* Multiple documents of the same type are allowed.
* Files are uploaded through the backend API.
* Unsupported file types must be rejected.
* Invalid uploads must not create database records.

---

# 8. Audit Logging

Every successful data modification must generate an audit log.

Tracked operations:

* CREATE
* UPDATE
* DELETE

Each audit entry records:

* Actor
* Entity
* Event Type
* Changed Fields
* Timestamp

Audit logs are append-only.

Deletion or modification of audit records is prohibited.

---

# 9. Role-Based Access Control

## Administrator Permissions

* Login
* Manage candidates
* Manage vacancies
* Manage recruitments
* Assign managers
* Update every recruitment stage
* Upload recruitment documents
* View dashboard
* View audit logs

---

## Manager Permissions

* Login
* View assigned recruitments
* View candidates
* View vacancies
* Update assigned recruitment stages
* Upload recruitment documents
* Add recruitment notes
* View dashboard

Managers cannot:

* Manage candidates
* Manage vacancies
* Modify other managers' stages
* Access audit logs

---

# 10. Functional Requirements

## 10.1 Authentication

Features:

* Login
* Logout
* JWT Authentication
* Password verification

---

## 10.2 Candidate Management

Features:

* Create Candidate
* Edit Candidate
* Delete Candidate
* Candidate Detail
* Candidate Listing
* Candidate Search

---

## 10.3 Vacancy Management

Features:

* Create Vacancy
* Edit Vacancy
* Delete Vacancy
* Vacancy Listing

---

## 10.4 Recruitment Management

Features:

* Create Recruitment
* Recruitment Detail
* Recruitment Listing

Business Rules:

* Candidate must exist.
* Vacancy must exist.
* Vacancy must be ACTIVE.

---

## 10.5 Recruitment Workflow

Features:

* View Timeline
* Update Stage Status
* Assign Manager
* Add Notes

Workflow execution must follow all business rules defined in Section 6.

---

## 10.6 Recruitment Documents

Features:

* Upload Document
* View Documents
* Download Document
* Delete Document

---

## 10.7 Dashboard

Dashboard displays:

* Total Candidates
* Total Active Vacancies
* Total Recruitments
* Recruitment Count by Current Stage
* Recruitment Count by Current Status

Charts are optional.

---

## 10.8 Audit Log

Features:

* View Audit Logs
* Filter by Entity
* Filter by Event Type

---

# 11. REST API

The backend exposes RESTful APIs.

## Authentication

* POST /auth/login
* POST /auth/logout

---

## Candidates

* GET /candidates
* GET /candidates/{id}
* POST /candidates
* PUT /candidates/{id}
* DELETE /candidates/{id}

---

## Vacancies

* GET /vacancies
* GET /vacancies/{id}
* POST /vacancies
* PUT /vacancies/{id}
* DELETE /vacancies/{id}

---

## Recruitments

* GET /recruitments
* GET /recruitments/{id}
* POST /recruitments

---

## Recruitment Stages

* GET /recruitments/{id}/stages
* PATCH /stages/{id}/status

---

## Recruitment Documents

* GET /recruitments/{id}/documents
* POST /recruitments/{id}/documents
* DELETE /documents/{id}

---

## Dashboard

* GET /dashboard/summary

---

## Audit Logs

* GET /audit-logs

---

# 12. Non-Functional Requirements

The system shall:

* Follow layered architecture.
* Centralize business rules in the Service Layer.
* Use PostgreSQL relational constraints.
* Validate every incoming request.
* Return standardized API responses.
* Return standardized API error responses.
* Maintain clean separation between Domain and Infrastructure.
* Be maintainable and extensible.
* Follow RESTful API conventions.

---

# 13. Technology Stack

## Repository

* Git
* GitHub
* Monorepo (npm Workspaces)

---

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* React Query
* Axios
* React Hook Form

---

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* Zod
* JWT
* bcrypt
* Multer

---

## Database

* PostgreSQL (Supabase)

---

## Object Storage

* Supabase Storage

---

## Deployment

### Frontend

* Vercel

### Backend

* Render

### Database

* Supabase PostgreSQL

### Object Storage

* Supabase Storage

---

# 14. Project Structure

The project follows a monorepo architecture using npm Workspaces.

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

# 15. Architecture

The application follows a layered architecture.

```text
Presentation Layer
        │
        ▼
Controller Layer
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL
```

Business rules exist exclusively within the Service Layer.

Infrastructure concerns such as database access, file storage, and authentication are isolated from business logic.

---

# 16. Design Principles

The system is designed according to the following principles:

* Recruitment is the Aggregate Root.
* Stage-centric recruitment workflow.
* Strict sequential workflow progression.
* Immutable completed stages.
* Generic recruitment document management.
* Centralized audit logging.
* Role-based authorization.
* Layered architecture.
* Separation of concerns.
* Maintainable and extensible software design.

---

# 17. Success Criteria

The project is considered complete when:

* All mandatory assessment requirements have been implemented.
* Recruitment workflow satisfies every defined business rule.
* Authentication and authorization operate correctly.
* Recruitment documents are successfully managed through Supabase Storage.
* Audit logging records every successful data modification.
* Dashboard statistics accurately represent system data.
* The application is publicly accessible.
* Source code is maintainable and aligned with this PRD.
* Documentation is complete and sufficient for reviewers to install, understand, execute, and evaluate the project.
