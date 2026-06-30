# Recruitment Management System Task Checklist

Source documents:

- `docs/prd.md`
- `docs/implementation-plan.md`

Source-of-truth rule:

Always use `docs/prd.md` and `docs/implementation-plan.md` as the authoritative references for implementation scope, business rules, architecture, phases, and completion criteria. Do not add, remove, or change implementation scope from this task checklist without reconciling it against those two documents first.

## Project-Wide Requirements

These are implementation standards, not standalone tasks. Apply them across every phase.

1. Keep the application as an internal recruitment management system only.
2. Use the monorepo structure with npm Workspaces.
   1. Create `apps/frontend`.
   2. Create `apps/backend`.
   3. Keep project documentation under `docs`.
3. Follow the required layered backend architecture.
   1. Route requests through the controller layer.
   2. Keep business rules in the service layer.
   3. Keep database access in the repository layer.
   4. Use Prisma ORM for PostgreSQL access.
   5. Keep infrastructure concerns separate from domain logic.
4. Follow consistent backend conventions.
   1. Use TypeScript.
   2. Use Express.js.
   3. Validate every incoming request with Zod.
   4. Return standardized API success responses.
   5. Return standardized API error responses.
   6. Centralize exception handling.
   7. Use dependency injection where applicable.
   8. Keep naming conventions consistent across controllers, services, repositories, routes, validations, and types.
5. Enforce required role-based access control.
   1. Support Administrator users.
   2. Support Manager users.
   3. Require authentication for all protected endpoints.
   4. Restrict administrator-only business operations.
   5. Restrict manager operations to documented permissions.
6. Follow frontend conventions.
   1. Use React.
   2. Use Vite.
   3. Use TypeScript.
   4. Use Tailwind CSS.
   5. Use React Router for routing.
   6. Use React Query for server state.
   7. Use Axios for API calls.
   8. Use React Hook Form for forms.
7. Use all required domain enums.
   1. Vacancy statuses: `ACTIVE`, `INACTIVE`.
   2. Recruitment stages: `APPLIED`, `SCREENING`, `TECHNICAL_TEST`, `INTERVIEW`, `ACCEPTANCE`.
   3. Recruitment stage statuses: `PENDING`, `PASSED`, `REJECTED`.
   4. Recruitment document types: `CV`, `PORTFOLIO`.
   5. Audit event types: `CREATE`, `UPDATE`, `DELETE`.

## Phase 1 - Project Foundation and Authentication

- [x] 1. Initialize the root project.
  - [x] 1.1. Create root `package.json`.
  - [x] 1.2. Configure npm Workspaces for frontend and backend apps.
  - [x] 1.3. Add root scripts required to run, build, and manage workspace apps.
  - [x] 1.4. Add project `.gitignore`.
- [x] 2. Initialize the backend project.
  - [x] 2.1. Create `apps/backend`.
  - [x] 2.2. Configure TypeScript.
  - [x] 2.3. Configure Express.js.
  - [x] 2.4. Configure ESLint.
  - [x] 2.5. Configure Prettier.
  - [x] 2.6. Configure environment variable loading.
  - [x] 2.7. Create the backend application entry point.
  - [x] 2.8. Create the backend server bootstrap.
- [x] 3. Install backend dependencies.
  - [x] 3.1. Install Express.
  - [x] 3.2. Install Prisma.
  - [x] 3.3. Install PostgreSQL driver.
  - [x] 3.4. Install Zod.
  - [x] 3.5. Install JWT dependency.
  - [x] 3.6. Install bcrypt dependency.
  - [x] 3.7. Install Multer.
  - [x] 3.8. Install dotenv.
  - [x] 3.9. Install CORS.
  - [x] 3.10. Install Morgan.
  - [x] 3.11. Install Supabase SDK.
- [x] 4. Create backend source structure.
  - [x] 4.1. Create `src/config`.
  - [x] 4.2. Create `src/constants`.
  - [x] 4.3. Create `src/controllers`.
  - [x] 4.4. Create `src/middlewares`.
  - [x] 4.5. Create `src/repositories`.
  - [x] 4.6. Create `src/routes`.
  - [x] 4.7. Create `src/services`.
  - [x] 4.8. Create `src/validations`.
  - [x] 4.9. Create `src/utils`.
  - [x] 4.10. Create `src/types`.
  - [x] 4.11. Create `src/prisma`.
  - [x] 4.12. Create `src/app.ts`.
  - [x] 4.13. Create `src/server.ts`.
- [x] 5. Configure Prisma.
  - [x] 5.1. Initialize Prisma in the backend app.
  - [x] 5.2. Configure PostgreSQL connection through environment variables.
  - [x] 5.3. Add Prisma client generation.
  - [x] 5.4. Add migration scripts.
- [x] 6. Implement the User model.
  - [x] 6.1. Add `id`.
  - [x] 6.2. Add `email`.
  - [x] 6.3. Add `password_hash`.
  - [x] 6.4. Add `role`.
  - [x] 6.5. Add `created_at`.
  - [x] 6.6. Add `updated_at`.
  - [x] 6.7. Defer the User relationship to created recruitments until the Recruitment model is introduced in Phase 4.
  - [x] 6.8. Defer the User relationship to assigned recruitment stages until the RecruitmentStage model is introduced in Phase 5.
  - [x] 6.9. Defer the User relationship to uploaded recruitment documents until the RecruitmentDocument model is introduced in Phase 7.
  - [x] 6.10. Defer the User relationship to audit logs until the AuditLog model is introduced in Phase 9.
- [x] 7. Create the initial database migration.
- [x] 8. Create the seed script.
  - [x] 8.1. Seed one Administrator account.
  - [x] 8.2. Seed one Manager account.
  - [x] 8.3. Hash seeded passwords with bcrypt.
- [x] 9. Implement authentication backend.
  - [x] 9.1. Implement password hashing with bcrypt.
  - [x] 9.2. Implement password verification with bcrypt.
  - [x] 9.3. Implement JWT access token generation.
  - [x] 9.4. Implement login service.
  - [x] 9.5. Implement login controller.
  - [x] 9.6. Register `POST /auth/login`.
  - [x] 9.7. Register `POST /auth/logout`.
  - [x] 9.8. Implement authentication middleware for protected API access.
  - [x] 9.9. Implement authorization middleware for role checks.
- [x] 10. Implement backend error and response utilities.
  - [x] 10.1. Implement global error handler.
  - [x] 10.2. Implement API response formatter.
  - [x] 10.3. Implement API error response formatter.
  - [x] 10.4. Implement exception classes.
- [x] 11. Initialize the frontend project.
  - [x] 11.1. Create `apps/frontend`.
  - [x] 11.2. Create React application using Vite.
  - [x] 11.3. Configure TypeScript.
  - [x] 11.4. Configure Tailwind CSS.
- [x] 12. Install frontend dependencies.
  - [x] 12.1. Install React Router.
  - [x] 12.2. Install React Query.
  - [x] 12.3. Install Axios.
  - [x] 12.4. Install React Hook Form.
  - [x] 12.5. Install Tailwind CSS.
- [x] 13. Create frontend source structure.
  - [x] 13.1. Create `src/api`.
  - [x] 13.2. Create `src/assets`.
  - [x] 13.3. Create `src/components`.
  - [x] 13.4. Create `src/features`.
  - [x] 13.5. Create `src/hooks`.
  - [x] 13.6. Create `src/layouts`.
  - [x] 13.7. Create `src/pages`.
  - [x] 13.8. Create `src/routes`.
  - [x] 13.9. Create `src/services`.
  - [x] 13.10. Create `src/types`.
  - [x] 13.11. Create `src/utils`.
- [x] 14. Implement frontend authentication.
  - [x] 14.1. Create login page.
  - [x] 14.2. Create authentication provider.
  - [x] 14.3. Implement protected routes.
  - [x] 14.4. Implement logout behavior.
  - [x] 14.5. Configure Axios interceptor.
  - [x] 14.6. Implement token persistence.
- [x] 15. Complete Phase 1 implementation readiness.
  - [x] 15.1. Ensure login succeeds with seeded users.
  - [x] 15.2. Ensure invalid credentials are rejected.
  - [x] 15.3. Ensure JWT tokens are generated.
  - [x] 15.4. Ensure protected routes require authentication.
  - [x] 15.5. Ensure logout clears authenticated access.
  - [x] 15.6. Commit Phase 1 as `feat: phase-1-project-foundation`.

## Phase 2 - Candidate Management

- [x] 1. Implement Candidate database model.
  - [x] 1.1. Add `id`.
  - [x] 1.2. Add `full_name`.
  - [x] 1.3. Add `email`.
  - [x] 1.4. Add `phone_number`.
  - [x] 1.5. Add `created_at`.
  - [x] 1.6. Add `updated_at`.
  - [x] 1.7. Defer the Candidate relationship to Recruitments until the Recruitment model is introduced in Phase 4.
  - [x] 1.8. Generate Candidate migration.
- [x] 2. Implement candidate repository.
  - [x] 2.1. Implement create candidate.
  - [x] 2.2. Implement update candidate.
  - [x] 2.3. Implement delete candidate.
  - [x] 2.4. Implement get candidate.
  - [x] 2.5. Implement list candidates.
  - [x] 2.6. Implement search candidates.
- [x] 3. Implement candidate service.
  - [x] 3.1. Enforce email uniqueness.
  - [x] 3.2. Enforce phone validation.
  - [x] 3.3. Keep candidate business rules in the service layer.
- [x] 4. Implement candidate validation.
  - [x] 4.1. Create `CandidateCreateSchema`.
  - [x] 4.2. Create `CandidateUpdateSchema`.
  - [x] 4.3. Validate candidate create requests.
  - [x] 4.4. Validate candidate update requests.
  - [x] 4.5. Validate candidate search input.
- [x] 5. Implement candidate controllers and routes.
  - [x] 5.1. Implement `GET /candidates`.
  - [x] 5.2. Implement `GET /candidates/{id}`.
  - [x] 5.3. Implement `POST /candidates`.
  - [x] 5.4. Implement `PUT /candidates/{id}`.
  - [x] 5.5. Implement `DELETE /candidates/{id}`.
  - [x] 5.6. Implement candidate search support.
- [x] 6. Implement candidate frontend pages.
  - [x] 6.1. Create Candidate List page.
  - [x] 6.2. Create Candidate Detail page.
  - [x] 6.3. Create Create Candidate page.
  - [x] 6.4. Create Edit Candidate page.
- [x] 7. Implement candidate frontend components.
  - [x] 7.1. Create Candidate Table.
  - [x] 7.2. Create Candidate Form.
  - [x] 7.3. Create Search Bar.
  - [x] 7.4. Create Delete Confirmation Dialog.
- [x] 8. Integrate candidate frontend with backend APIs.
  - [x] 8.1. Fetch candidate list.
  - [x] 8.2. Fetch candidate detail.
  - [x] 8.3. Submit candidate create form.
  - [x] 8.4. Submit candidate edit form.
  - [x] 8.5. Execute candidate delete action.
  - [x] 8.6. Execute candidate search.
  - [x] 8.7. Surface validation and API errors.
- [x] 9. Complete Phase 2 implementation readiness.
  - [x] 9.1. Ensure Candidate CRUD is implemented end to end.
  - [x] 9.2. Ensure candidate search is implemented end to end.
  - [x] 9.3. Ensure candidate validation and error handling are implemented.
  - [x] 9.4. Commit Phase 2 as `feat: phase 2 candidate management`.

## Phase 3 - Vacancy Management

- [x] 1. Implement Vacancy database model.
  - [x] 1.1. Add `id`.
  - [x] 1.2. Add `position_name`.
  - [x] 1.3. Add `department`.
  - [x] 1.4. Add `hiring_needed`.
  - [x] 1.5. Add `status`.
  - [x] 1.6. Add `created_at`.
  - [x] 1.7. Add `updated_at`.
  - [x] 1.8. Defer the Vacancy relationship to Recruitments until the Recruitment model is introduced in Phase 4.
  - [x] 1.9. Generate Vacancy migration.
- [x] 2. Implement vacancy repository.
  - [x] 2.1. Implement create vacancy.
  - [x] 2.2. Implement update vacancy.
  - [x] 2.3. Implement delete vacancy.
  - [x] 2.4. Implement get vacancy.
  - [x] 2.5. Implement list vacancies.
- [x] 3. Implement vacancy service.
  - [x] 3.1. Enforce hiring needed validation.
  - [x] 3.2. Enforce `ACTIVE` and `INACTIVE` status validation.
  - [x] 3.3. Keep vacancy business rules in the service layer.
- [x] 4. Implement vacancy validation.
  - [x] 4.1. Create vacancy create schema.
  - [x] 4.2. Create vacancy update schema.
  - [x] 4.3. Validate vacancy create requests.
  - [x] 4.4. Validate vacancy update requests.
- [x] 5. Implement vacancy controllers and routes.
  - [x] 5.1. Implement `GET /vacancies`.
  - [x] 5.2. Implement `GET /vacancies/{id}`.
  - [x] 5.3. Implement `POST /vacancies`.
  - [x] 5.4. Implement `PUT /vacancies/{id}`.
  - [x] 5.5. Implement `DELETE /vacancies/{id}`.
- [x] 6. Implement vacancy frontend pages.
  - [x] 6.1. Create Vacancy List page.
  - [x] 6.2. Create Create Vacancy page.
  - [x] 6.3. Create Edit Vacancy page.
- [x] 7. Implement vacancy frontend components.
  - [x] 7.1. Create Vacancy Table.
  - [x] 7.2. Create Vacancy Form.
- [x] 8. Integrate vacancy frontend with backend APIs.
  - [x] 8.1. Fetch vacancy list.
  - [x] 8.2. Fetch vacancy detail for editing.
  - [x] 8.3. Submit vacancy create form.
  - [x] 8.4. Submit vacancy edit form.
  - [x] 8.5. Execute vacancy delete action.
  - [x] 8.6. Surface validation and API errors.
- [x] 9. Complete Phase 3 implementation readiness.
  - [x] 9.1. Ensure Vacancy CRUD is implemented end to end.
  - [x] 9.2. Ensure vacancy validation is implemented.
  - [x] 9.3. Ensure vacancy status updates are implemented.
  - [x] 9.4. Commit Phase 3 as `feat: phase 3 vacancy management`.

## Phase 4 - Recruitment Core

- [ ] 1. Implement Recruitment database model.
  - [ ] 1.1. Add `id`.
  - [ ] 1.2. Add `candidate_id`.
  - [ ] 1.3. Add `vacancy_id`.
  - [ ] 1.4. Add `created_by`.
  - [ ] 1.5. Add `created_at`.
  - [ ] 1.6. Add `updated_at`.
  - [ ] 1.7. Model Recruitment belongs to Candidate.
  - [ ] 1.8. Model Recruitment belongs to Vacancy.
  - [ ] 1.9. Model Recruitment created by User.
  - [ ] 1.10. Model Recruitment owns many Recruitment Stages.
  - [ ] 1.11. Model Recruitment owns many Recruitment Documents.
  - [ ] 1.12. Generate Recruitment migration.
- [ ] 2. Implement recruitment repository.
  - [ ] 2.1. Implement create recruitment.
  - [ ] 2.2. Implement get recruitment.
  - [ ] 2.3. Implement list recruitments.
- [ ] 3. Implement recruitment service.
  - [ ] 3.1. Validate candidate exists before creating recruitment.
  - [ ] 3.2. Validate vacancy exists before creating recruitment.
  - [ ] 3.3. Validate vacancy status is `ACTIVE` before creating recruitment.
  - [ ] 3.4. Create recruitment as the aggregate root.
  - [ ] 3.5. Automatically create the first recruitment stage as `APPLIED`.
  - [ ] 3.6. Set the first recruitment stage status to `PENDING`.
  - [ ] 3.7. Keep recruitment creation and first-stage creation consistent.
- [ ] 4. Implement recruitment validation.
  - [ ] 4.1. Create recruitment create schema.
  - [ ] 4.2. Validate recruitment creation input.
- [ ] 5. Implement recruitment controllers and routes.
  - [ ] 5.1. Implement `GET /recruitments`.
  - [ ] 5.2. Implement `GET /recruitments/{id}`.
  - [ ] 5.3. Implement `POST /recruitments`.
- [ ] 6. Implement recruitment frontend pages.
  - [ ] 6.1. Create Recruitment List page.
  - [ ] 6.2. Create Recruitment Detail page.
  - [ ] 6.3. Create Create Recruitment page.
- [ ] 7. Implement recruitment frontend components.
  - [ ] 7.1. Create Candidate Selector.
  - [ ] 7.2. Create Vacancy Selector.
- [ ] 8. Integrate recruitment frontend with backend APIs.
  - [ ] 8.1. Fetch recruitment list.
  - [ ] 8.2. Fetch recruitment detail.
  - [ ] 8.3. Fetch candidates for recruitment creation.
  - [ ] 8.4. Fetch active vacancies for recruitment creation.
  - [ ] 8.5. Submit recruitment creation form.
  - [ ] 8.6. Surface validation and API errors.
- [ ] 9. Complete Phase 4 implementation readiness.
  - [ ] 9.1. Ensure recruitment creation is implemented end to end.
  - [ ] 9.2. Ensure recruitment creation validates candidate and vacancy requirements.
  - [ ] 9.3. Ensure initial `APPLIED` and `PENDING` stage creation is implemented.
  - [ ] 9.4. Commit Phase 4 as `phase-4-recruitment-core`.

## Phase 5 - Recruitment Workflow Engine

- [ ] 1. Implement RecruitmentStage database model.
  - [ ] 1.1. Add `id`.
  - [ ] 1.2. Add `recruitment_id`.
  - [ ] 1.3. Add `stage`.
  - [ ] 1.4. Add `status`.
  - [ ] 1.5. Add `assigned_user_id`.
  - [ ] 1.6. Add `scheduled_at`.
  - [ ] 1.7. Add `completed_at`.
  - [ ] 1.8. Add `notes`.
  - [ ] 1.9. Add `created_at`.
  - [ ] 1.10. Add `updated_at`.
  - [ ] 1.11. Model RecruitmentStage belongs to Recruitment.
  - [ ] 1.12. Model RecruitmentStage assigned to User.
  - [ ] 1.13. Generate RecruitmentStage migration.
- [ ] 2. Implement recruitment stage repository.
  - [ ] 2.1. Implement create stage.
  - [ ] 2.2. Implement get stage.
  - [ ] 2.3. Implement list stages.
  - [ ] 2.4. Implement update stage.
- [ ] 3. Implement workflow sequence rules.
  - [ ] 3.1. Define the fixed stage order: `APPLIED`, `SCREENING`, `TECHNICAL_TEST`, `INTERVIEW`, `ACCEPTANCE`.
  - [ ] 3.2. Prevent stage skipping.
  - [ ] 3.3. Prevent stage reordering.
  - [ ] 3.4. Require a stage to be completed before the next stage is created.
  - [ ] 3.5. Allow only one `PENDING` stage per recruitment.
  - [ ] 3.6. Treat `PENDING` as the active stage status.
- [ ] 4. Implement stage completion rules.
  - [ ] 4.1. Allow stage status updates to `PASSED`.
  - [ ] 4.2. Allow stage status updates to `REJECTED`.
  - [ ] 4.3. Set `completed_at` when a stage is completed.
  - [ ] 4.4. Make completed stages immutable.
  - [ ] 4.5. Prevent status changes after stage completion.
  - [ ] 4.6. Prevent notes changes after stage completion.
- [ ] 5. Implement pass-flow behavior.
  - [ ] 5.1. When a stage is marked `PASSED`, create the next workflow stage with status `PENDING`.
  - [ ] 5.2. Do not create a next stage after `ACCEPTANCE` is marked `PASSED`.
  - [ ] 5.3. Complete the workflow when `ACCEPTANCE` is passed.
- [ ] 6. Implement reject-flow behavior.
  - [ ] 6.1. When a stage is marked `REJECTED`, terminate the recruitment workflow.
  - [ ] 6.2. Prevent additional stages from being created after rejection.
- [ ] 7. Implement stage notes behavior.
  - [ ] 7.1. Allow notes to be added while a stage is active.
  - [ ] 7.2. Persist notes on the recruitment stage.
  - [ ] 7.3. Enforce notes immutability after stage completion.
- [ ] 8. Implement recruitment stage validation.
  - [ ] 8.1. Validate stage status update requests.
  - [ ] 8.2. Validate notes input.
  - [ ] 8.3. Validate stage identifiers.
- [ ] 9. Implement recruitment stage controllers and routes.
  - [ ] 9.1. Implement `GET /recruitments/{id}/stages`.
  - [ ] 9.2. Implement `PATCH /stages/{id}/status`.
- [ ] 10. Implement recruitment timeline frontend.
  - [ ] 10.1. Create Recruitment Timeline page or section.
  - [ ] 10.2. Create Timeline component.
  - [ ] 10.3. Create Stage Card component.
  - [ ] 10.4. Create Status Badge component.
  - [ ] 10.5. Create Stage Notes component.
- [ ] 11. Integrate recruitment workflow frontend with backend APIs.
  - [ ] 11.1. Fetch stage timeline for a recruitment.
  - [ ] 11.2. Submit stage status updates.
  - [ ] 11.3. Submit stage notes updates.
  - [ ] 11.4. Refresh timeline after workflow changes.
  - [ ] 11.5. Surface validation, authorization, and API errors.
- [ ] 12. Complete Phase 5 implementation readiness.
  - [ ] 12.1. Ensure pass flow is implemented.
  - [ ] 12.2. Ensure reject flow is implemented.
  - [ ] 12.3. Ensure sequential validation is implemented.
  - [ ] 12.4. Ensure completed stage immutability is implemented.
  - [ ] 12.5. Ensure timeline rendering is implemented.
  - [ ] 12.6. Commit Phase 5 as `phase-5-recruitment-workflow`.

## Phase 6 - Stage Assignment and Authorization

- [ ] 1. Implement stage assignment repository support.
  - [ ] 1.1. Implement assignment update for recruitment stages.
  - [ ] 1.2. Persist `assigned_user_id` on stages.
- [ ] 2. Implement assignment service rules.
  - [ ] 2.1. Allow manager assignment to recruitment stages.
  - [ ] 2.2. Keep assignment business rules in the service layer.
  - [ ] 2.3. Preserve existing workflow rules when assignment changes.
- [ ] 3. Implement authorization rules for stage updates.
  - [ ] 3.1. Allow Administrator users to update every recruitment stage.
  - [ ] 3.2. Allow Manager users to update only stages assigned to themselves.
  - [ ] 3.3. Prevent Manager users from modifying stages assigned to other managers.
  - [ ] 3.4. Prevent Manager users from managing candidates.
  - [ ] 3.5. Prevent Manager users from managing vacancies.
  - [ ] 3.6. Prevent Manager users from accessing audit logs.
- [ ] 4. Implement middleware for authorization and ownership.
  - [ ] 4.1. Implement role authorization middleware.
  - [ ] 4.2. Implement stage ownership validation.
  - [ ] 4.3. Apply authorization middleware to protected stage update routes.
  - [ ] 4.4. Apply administrator-only middleware to administrator-only operations.
- [ ] 5. Implement manager-facing recruitment access.
  - [ ] 5.1. Allow managers to view assigned recruitments.
  - [ ] 5.2. Allow managers to review candidate information.
  - [ ] 5.3. Allow managers to review vacancy information.
  - [ ] 5.4. Allow managers to upload recruitment documents.
  - [ ] 5.5. Allow managers to add notes to assigned active stages.
  - [ ] 5.6. Allow managers to view dashboard.
- [ ] 6. Implement stage assignment frontend.
  - [ ] 6.1. Create Stage Assignment page or section.
  - [ ] 6.2. Create Manager Selector component.
  - [ ] 6.3. Create Assigned Manager Badge component.
  - [ ] 6.4. Integrate assignment updates with backend API.
  - [ ] 6.5. Surface assignment and authorization errors.
- [ ] 7. Complete Phase 6 implementation readiness.
  - [ ] 7.1. Ensure stage assignment is implemented.
  - [ ] 7.2. Ensure unauthorized stage updates are blocked.
  - [ ] 7.3. Ensure Administrator override is implemented.
  - [ ] 7.4. Commit Phase 6 as `phase-6-stage-assignment`.

## Phase 7 - Recruitment Documents

- [ ] 1. Implement RecruitmentDocument database model.
  - [ ] 1.1. Add `id`.
  - [ ] 1.2. Add `recruitment_id`.
  - [ ] 1.3. Add `document_type`.
  - [ ] 1.4. Add `original_filename`.
  - [ ] 1.5. Add `stored_filename`.
  - [ ] 1.6. Add `mime_type`.
  - [ ] 1.7. Add `file_size`.
  - [ ] 1.8. Add `storage_provider`.
  - [ ] 1.9. Add `storage_path`.
  - [ ] 1.10. Add `uploaded_by`.
  - [ ] 1.11. Add `created_at`.
  - [ ] 1.12. Add `updated_at`.
  - [ ] 1.13. Model RecruitmentDocument belongs to Recruitment.
  - [ ] 1.14. Model RecruitmentDocument uploaded by User.
  - [ ] 1.15. Generate RecruitmentDocument migration.
- [ ] 2. Configure Supabase Storage infrastructure.
  - [ ] 2.1. Configure Supabase Storage client.
  - [ ] 2.2. Configure required storage environment variables.
  - [ ] 2.3. Create storage bucket.
  - [ ] 2.4. Configure backend access to the storage bucket.
- [ ] 3. Implement recruitment document repository.
  - [ ] 3.1. Implement save document metadata.
  - [ ] 3.2. Implement list documents.
  - [ ] 3.3. Implement delete document metadata.
- [ ] 4. Implement recruitment document service.
  - [ ] 4.1. Implement document upload.
  - [ ] 4.2. Implement document download.
  - [ ] 4.3. Implement document delete.
  - [ ] 4.4. Store files in Supabase Storage.
  - [ ] 4.5. Store only document metadata in PostgreSQL.
  - [ ] 4.6. Allow multiple documents per recruitment.
  - [ ] 4.7. Allow multiple documents of the same type per recruitment.
  - [ ] 4.8. Reject unsupported document types.
  - [ ] 4.9. Reject unsupported file types.
  - [ ] 4.10. Validate MIME type.
  - [ ] 4.11. Validate file size.
  - [ ] 4.12. Ensure invalid uploads do not create database records.
  - [ ] 4.13. Ensure storage consistency between Supabase Storage and PostgreSQL metadata.
- [ ] 5. Implement recruitment document validation.
  - [ ] 5.1. Validate `CV` document type.
  - [ ] 5.2. Validate `PORTFOLIO` document type.
  - [ ] 5.3. Validate upload request input.
  - [ ] 5.4. Validate document identifiers.
- [ ] 6. Implement recruitment document controllers and routes.
  - [ ] 6.1. Implement `GET /recruitments/{id}/documents`.
  - [ ] 6.2. Implement `POST /recruitments/{id}/documents`.
  - [ ] 6.3. Implement `DELETE /documents/{id}`.
  - [ ] 6.4. Implement download behavior for recruitment documents.
- [ ] 7. Implement recruitment document frontend.
  - [ ] 7.1. Create Recruitment Documents page or section.
  - [ ] 7.2. Create Upload Dialog component.
  - [ ] 7.3. Create Document Table component.
  - [ ] 7.4. Create Download Button component.
  - [ ] 7.5. Create Delete Button component.
- [ ] 8. Integrate recruitment document frontend with backend APIs.
  - [ ] 8.1. Fetch documents for a recruitment.
  - [ ] 8.2. Upload a document for a recruitment.
  - [ ] 8.3. Download a recruitment document.
  - [ ] 8.4. Delete a recruitment document.
  - [ ] 8.5. Surface upload, download, delete, validation, and API errors.
- [ ] 9. Complete Phase 7 implementation readiness.
  - [ ] 9.1. Ensure document upload is implemented end to end.
  - [ ] 9.2. Ensure document download is implemented end to end.
  - [ ] 9.3. Ensure document delete is implemented end to end.
  - [ ] 9.4. Ensure invalid files are rejected.
  - [ ] 9.5. Ensure invalid document types are rejected.
  - [ ] 9.6. Commit Phase 7 as `phase-7-recruitment-documents`.

## Phase 8 - Dashboard

- [ ] 1. Implement dashboard backend aggregation.
  - [ ] 1.1. Calculate total candidates.
  - [ ] 1.2. Calculate total active vacancies.
  - [ ] 1.3. Calculate total recruitments.
  - [ ] 1.4. Calculate recruitment count by current stage.
  - [ ] 1.5. Calculate recruitment count by current status.
- [ ] 2. Implement dashboard service.
  - [ ] 2.1. Keep dashboard aggregation rules in the service layer.
  - [ ] 2.2. Ensure dashboard values represent current system data.
  - [ ] 2.3. Handle empty data states.
- [ ] 3. Implement dashboard controller and route.
  - [ ] 3.1. Implement `GET /dashboard/summary`.
  - [ ] 3.2. Protect dashboard endpoint with authentication.
  - [ ] 3.3. Permit Administrator access.
  - [ ] 3.4. Permit Manager access.
- [ ] 4. Implement dashboard frontend.
  - [ ] 4.1. Create Dashboard page.
  - [ ] 4.2. Create Statistic Cards.
  - [ ] 4.3. Create Summary Panels.
  - [ ] 4.4. Display total candidates.
  - [ ] 4.5. Display total active vacancies.
  - [ ] 4.6. Display total recruitments.
  - [ ] 4.7. Display recruitment count by current stage.
  - [ ] 4.8. Display recruitment count by current status.
  - [ ] 4.9. Implement loading state.
  - [ ] 4.10. Implement empty state.
  - [ ] 4.11. Surface dashboard API errors.
- [ ] 5. Complete Phase 8 implementation readiness.
  - [ ] 5.1. Ensure dashboard aggregation is implemented.
  - [ ] 5.2. Ensure dashboard empty state is implemented.
  - [ ] 5.3. Ensure dashboard loading state is implemented.
  - [ ] 5.4. Commit Phase 8 as `phase-8-dashboard`.

## Phase 9 - Audit Logging

- [ ] 1. Implement AuditLog database model.
  - [ ] 1.1. Add `id`.
  - [ ] 1.2. Add `entity_type`.
  - [ ] 1.3. Add `entity_id`.
  - [ ] 1.4. Add `event_type`.
  - [ ] 1.5. Add `actor_id`.
  - [ ] 1.6. Add `changes` as JSON.
  - [ ] 1.7. Add `created_at`.
  - [ ] 1.8. Model AuditLog generated by User.
  - [ ] 1.9. Generate AuditLog migration.
- [ ] 2. Implement audit repository.
  - [ ] 2.1. Implement create audit log.
  - [ ] 2.2. Implement list audit logs.
  - [ ] 2.3. Implement filter audit logs by entity.
  - [ ] 2.4. Implement filter audit logs by event type.
- [ ] 3. Implement audit service.
  - [ ] 3.1. Record audit logs for successful `CREATE` operations.
  - [ ] 3.2. Record audit logs for successful `UPDATE` operations.
  - [ ] 3.3. Record audit logs for successful `DELETE` operations.
  - [ ] 3.4. Store actor in each audit entry.
  - [ ] 3.5. Store entity type in each audit entry.
  - [ ] 3.6. Store entity id in each audit entry.
  - [ ] 3.7. Store event type in each audit entry.
  - [ ] 3.8. Store changed fields in each audit entry.
  - [ ] 3.9. Store timestamp in each audit entry.
  - [ ] 3.10. Make audit logs append-only.
  - [ ] 3.11. Prohibit audit log modification.
  - [ ] 3.12. Prohibit audit log deletion.
- [ ] 4. Integrate audit logging into write operations.
  - [ ] 4.1. Integrate audit logging into candidate create, update, and delete.
  - [ ] 4.2. Integrate audit logging into vacancy create, update, and delete.
  - [ ] 4.3. Integrate audit logging into recruitment create.
  - [ ] 4.4. Integrate audit logging into recruitment stage updates.
  - [ ] 4.5. Integrate audit logging into stage assignment updates.
  - [ ] 4.6. Integrate audit logging into recruitment document upload and delete.
- [ ] 5. Implement audit validation.
  - [ ] 5.1. Validate audit log list filters.
  - [ ] 5.2. Validate entity filter input.
  - [ ] 5.3. Validate event type filter input.
- [ ] 6. Implement audit controller and route.
  - [ ] 6.1. Implement `GET /audit-logs`.
  - [ ] 6.2. Restrict audit logs to Administrator users.
- [ ] 7. Implement audit frontend.
  - [ ] 7.1. Create Audit Log page.
  - [ ] 7.2. Create Audit Table component.
  - [ ] 7.3. Create Entity Filter component.
  - [ ] 7.4. Create Event Filter component.
  - [ ] 7.5. Fetch audit logs.
  - [ ] 7.6. Filter audit logs by entity.
  - [ ] 7.7. Filter audit logs by event type.
  - [ ] 7.8. Surface audit API errors.
- [ ] 8. Complete Phase 9 implementation readiness.
  - [ ] 8.1. Ensure CRUD operations generate audit logs.
  - [ ] 8.2. Ensure change tracking is implemented.
  - [ ] 8.3. Ensure audit filtering is implemented.
  - [ ] 8.4. Commit Phase 9 as `phase-9-audit-logging`.

## Phase 10 - Production Readiness

- [ ] 1. Complete backend readiness work.
  - [ ] 1.1. Refactor backend code where required.
  - [ ] 1.2. Remove dead backend code.
  - [ ] 1.3. Review API consistency.
  - [ ] 1.4. Review request validation coverage.
  - [ ] 1.5. Review error handling consistency.
  - [ ] 1.6. Review backend performance.
- [ ] 2. Complete frontend readiness work.
  - [ ] 2.1. Review responsive behavior.
  - [ ] 2.2. Review UI consistency.
  - [ ] 2.3. Implement required loading states.
  - [ ] 2.4. Implement required empty states.
  - [ ] 2.5. Implement required error states.
  - [ ] 2.6. Review accessibility.
- [ ] 3. Complete Supabase readiness work.
  - [ ] 3.1. Configure Supabase PostgreSQL.
  - [ ] 3.2. Configure Supabase Storage.
  - [ ] 3.3. Verify Supabase environment variables.
  - [ ] 3.4. Verify database connectivity.
  - [ ] 3.5. Verify object storage connectivity.
- [ ] 4. Complete Render backend deployment.
  - [ ] 4.1. Deploy backend to Render.
  - [ ] 4.2. Verify backend environment variables.
  - [ ] 4.3. Verify backend health check.
  - [ ] 4.4. Verify backend CORS configuration.
  - [ ] 4.5. Verify backend production build.
- [ ] 5. Complete Vercel frontend deployment.
  - [ ] 5.1. Deploy frontend to Vercel.
  - [ ] 5.2. Verify frontend production build.
  - [ ] 5.3. Verify frontend API connectivity.
  - [ ] 5.4. Verify frontend route rewrites.
  - [ ] 5.5. Verify frontend environment variables.
- [ ] 6. Complete documentation readiness.
  - [ ] 6.1. Complete `README.md`.
  - [ ] 6.2. Review `docs/prd.md`.
  - [ ] 6.3. Review `docs/implementation-plan.md`.
  - [ ] 6.4. Complete `docs/ERD.md`.
  - [ ] 6.5. Complete `docs/AI_USAGE_REPORT.md`.
- [ ] 7. Complete final implementation coverage.
  - [ ] 7.1. Ensure authentication implementation is complete.
  - [ ] 7.2. Ensure RBAC implementation is complete.
  - [ ] 7.3. Ensure Candidate implementation is complete.
  - [ ] 7.4. Ensure Vacancy implementation is complete.
  - [ ] 7.5. Ensure Recruitment implementation is complete.
  - [ ] 7.6. Ensure Workflow implementation is complete.
  - [ ] 7.7. Ensure Stage Assignment implementation is complete.
  - [ ] 7.8. Ensure Recruitment Documents implementation is complete.
  - [ ] 7.9. Ensure Dashboard implementation is complete.
  - [ ] 7.10. Ensure Audit Logging implementation is complete.
  - [ ] 7.11. Ensure frontend public deployment is complete.
  - [ ] 7.12. Ensure backend public deployment is complete.
  - [ ] 7.13. Ensure database is operational on Supabase.
  - [ ] 7.14. Ensure object storage is operational on Supabase.
  - [ ] 7.15. Commit Phase 10 as `phase-10-production-readiness`.
