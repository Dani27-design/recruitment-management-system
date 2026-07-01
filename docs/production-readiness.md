# Production Readiness

This document records Phase 10 readiness for the Recruitment Management System.

Source-of-truth references:

- `docs/prd.md`
- `docs/implementation-plan.md`

## Local Verification

Run these commands before deployment:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Backend Deployment: Render

Render configuration is provided in `render.yaml`.

Backend settings:

- Root directory: repository root
- Build command: `npm install && npm run build -w apps/backend`
- Start command: `npm start -w apps/backend`
- Health check path: `/health`

Required environment variables:

- `NODE_ENV=production`
- `PORT=4000`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=1d`
- `FRONTEND_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STORAGE_BUCKET_NAME=database`

## Frontend Deployment: Vercel

Frontend routing configuration is provided in `apps/frontend/vercel.json`.

Vercel settings:

- Root directory: `apps/frontend`
- Build command: `npm run build`
- Output directory: `dist`

Required environment variable:

- `VITE_API_BASE_URL`

## Supabase Readiness

Supabase PostgreSQL is configured through `DATABASE_URL`.

Supabase Storage is configured through:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STORAGE_BUCKET_NAME=database`

The storage bucket must be private and available to the backend service role.

## Database Migration And Seed

Run migrations from the backend workspace:

```bash
npm run prisma:migrate -w apps/backend
```

Run seed data from the backend workspace:

```bash
npm run prisma:seed -w apps/backend
```

## Health Check

The backend exposes:

```text
GET /health
```

Expected response:

```json
{
  "success": true,
  "message": "Health check passed",
  "data": {
    "status": "ok"
  }
}
```

## External Verification Required

Public deployment verification requires live Render, Vercel, and Supabase project access.

The following items must be verified in the deployed environment:

- Backend public URL responds at `/health`.
- Backend CORS allows the Vercel frontend origin.
- Frontend can call backend APIs through `VITE_API_BASE_URL`.
- Database migrations are applied to Supabase PostgreSQL.
- Supabase Storage bucket exists and accepts document uploads through backend APIs.
