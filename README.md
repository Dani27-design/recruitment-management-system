# Recruitment Management System

Internal recruitment management web application for HR administrators and interview managers.

The authoritative product and implementation references are:

- `docs/prd.md`
- `docs/implementation-plan.md`

## Project Overview

Recruitment Management System (RMS) centralizes internal hiring operations in one application. It supports candidate management, vacancy management, recruitment workflow execution, document management, dashboard statistics, and audit history.

The application is intended for internal company users only:

- Administrator: HR user with full access to business operations.
- Manager: interviewer/evaluator who can view assigned recruitment work and update assigned stages.

The application is not a public job portal and does not support candidate self-registration or candidate login.

## Tech Stack

Backend:

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT authentication
- bcrypt password hashing
- Multer
- Supabase Storage SDK
- Vitest

Frontend:

- React
- Vite
- TypeScript
- React Router
- TanStack React Query
- Axios
- React Hook Form
- Tailwind CSS
- Vitest

Repository and tooling:

- npm Workspaces
- ESLint
- Prettier
- Render backend deployment
- Vercel frontend deployment
- Supabase PostgreSQL and Storage

## Installation Steps

Prerequisites:

- Node.js
- npm
- PostgreSQL database or Supabase PostgreSQL project
- Supabase Storage bucket for recruitment documents

Install dependencies from the repository root:

```bash
npm install
```

## Environment Setup

Backend environment file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Backend variables:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recruitment_management_system
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/recruitment_management_system
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STORAGE_BUCKET_NAME=database
```

Frontend environment file:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Frontend variables:

```env
VITE_API_BASE_URL=http://localhost:4000
```

For Supabase production-style setup:

- `DATABASE_URL` should use the transaction-mode pooler for runtime.
- `DIRECT_URL` should use the session-mode pooler for Prisma migrations.
- If the database password contains special URL characters such as `#`, encode them, for example `#` becomes `%23`.
- `SUPABASE_SERVICE_ROLE_KEY` must be a server-side secret and must not be exposed in frontend environment variables.

## Database Setup

Generate Prisma Client:

```bash
npm run prisma:generate -w apps/backend
```

Apply migrations in development:

```bash
npm run prisma:migrate -w apps/backend
```

Apply migrations in production:

```bash
npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma
```

Seed initial users:

```bash
npm run prisma:seed -w apps/backend
```

Seeded accounts:

```text
admin@rms.local / Admin@12345
manager@rms.local / Manager@12345
```

Supabase Storage:

- Create a private bucket named `database`.
- Configure backend `SUPABASE_URL`.
- Configure backend `SUPABASE_SERVICE_ROLE_KEY`.
- Configure backend `STORAGE_BUCKET_NAME=database`.

## Run Instructions

Run backend and frontend together:

```bash
npm run dev
```

Run backend only:

```bash
npm run dev:backend
```

Run frontend only:

```bash
npm run dev:frontend
```

Default local URLs:

```text
Backend: http://localhost:4000
Frontend: http://localhost:5173
```

Build all workspaces:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run lint:

```bash
npm run lint
```

Run typecheck:

```bash
npm run typecheck
```

## Short API Documentation

Base URL:

```text
http://localhost:4000
```

Production backend example:

```text
https://recruitment-management-system-backend.onrender.com
```

Most endpoints require:

```http
Authorization: Bearer <accessToken>
```

API responses use a consistent success/error format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Authentication:

- `POST /auth/login` - login with email and password.
- `POST /auth/logout` - logout current authenticated user.

Health:

- `GET /health` - public health check.

Candidates:

- `GET /candidates` - list candidates. Administrator and Manager.
- `GET /candidates/:id` - get candidate detail. Administrator and Manager.
- `POST /candidates` - create candidate. Administrator only.
- `PUT /candidates/:id` - update candidate. Administrator only.
- `DELETE /candidates/:id` - delete candidate. Administrator only.

Vacancies:

- `GET /vacancies` - list vacancies. Administrator and Manager.
- `GET /vacancies/:id` - get vacancy detail. Administrator and Manager.
- `POST /vacancies` - create vacancy. Administrator only.
- `PUT /vacancies/:id` - update vacancy. Administrator only.
- `DELETE /vacancies/:id` - delete vacancy. Administrator only.

Recruitments:

- `GET /recruitments` - list recruitments. Administrator and Manager.
- `GET /recruitments/:id` - get recruitment detail. Administrator and Manager.
- `POST /recruitments` - create recruitment. Administrator only.
- `GET /recruitments/:id/stages` - list recruitment stages.
- `GET /recruitments/:id/documents` - list recruitment documents.
- `POST /recruitments/:id/documents` - upload recruitment document using multipart field `file`.

Stages:

- `PATCH /stages/:id/status` - update assigned stage status or notes. Administrator and assigned Manager.
- `PATCH /stages/:id/assignment` - assign manager to stage. Administrator only.

Documents:

- `GET /documents/:id/download` - download recruitment document. Administrator and Manager.
- `DELETE /documents/:id` - delete recruitment document. Administrator only.

Users:

- `GET /users/managers` - list manager users. Administrator only.

Dashboard:

- `GET /dashboard/summary` - recruitment dashboard summary. Administrator and Manager.

Audit Logs:

- `GET /audit-logs` - list audit logs. Administrator only.

Core enums:

```text
Role: ADMINISTRATOR, MANAGER
VacancyStatus: ACTIVE, INACTIVE
RecruitmentStageName: APPLIED, SCREENING, TECHNICAL_TEST, INTERVIEW, ACCEPTANCE
RecruitmentStageStatus: PENDING, PASSED, REJECTED
RecruitmentDocumentType: CV, PORTFOLIO
AuditEventType: CREATE, UPDATE, DELETE
```

## Short Architectural Explanation

The project uses a phase-based vertical slice strategy and layered backend architecture.

Backend flow:

```text
Presentation Layer
        |
Controller Layer
        |
Service Layer
        |
Repository Layer
        |
Prisma ORM
        |
PostgreSQL
```

Responsibilities:

- Controllers handle HTTP input and output.
- Validations use Zod request schemas.
- Services contain business rules.
- Repositories isolate database access.
- Prisma maps the domain model to PostgreSQL.
- Middleware handles authentication, authorization, validation, upload handling, and centralized errors.

Frontend flow:

- Pages and components render role-specific workflows.
- API modules call backend endpoints through Axios.
- React Query manages server state.
- React Router controls application navigation.
- Authentication state controls protected application access.

Primary business rules:

- All protected endpoints require JWT authentication.
- Administrators have unrestricted business access.
- Managers may only modify recruitment stages assigned to themselves.
- Completed stages are immutable.
- Only one recruitment stage may be active at a time.
- Recruitment documents are stored through Supabase Storage.
- Audit logs record business changes for traceability.

## AI Usage

AI was used as a development assistant for planning, documentation drafting, implementation guidance, and verification support during the project workflow.

AI is not a runtime product feature of this application. The PRD explicitly excludes AI-assisted recruitment from product scope, so the system does not perform resume parsing, candidate scoring, AI recommendations, or automated hiring decisions.

All implementation decisions should remain aligned with:

- `docs/prd.md`
- `docs/implementation-plan.md`
