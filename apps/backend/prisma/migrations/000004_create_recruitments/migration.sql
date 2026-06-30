CREATE TYPE "RecruitmentStageName" AS ENUM ('APPLIED', 'SCREENING', 'TECHNICAL_TEST', 'INTERVIEW', 'ACCEPTANCE');

CREATE TYPE "RecruitmentStageStatus" AS ENUM ('PENDING', 'PASSED', 'REJECTED');

CREATE TABLE "recruitments" (
  "id" TEXT NOT NULL,
  "candidate_id" TEXT NOT NULL,
  "vacancy_id" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "recruitments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "recruitment_stages" (
  "id" TEXT NOT NULL,
  "recruitment_id" TEXT NOT NULL,
  "stage" "RecruitmentStageName" NOT NULL,
  "status" "RecruitmentStageStatus" NOT NULL,
  "assigned_user_id" TEXT,
  "scheduled_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "recruitment_stages_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "recruitments"
  ADD CONSTRAINT "recruitments_candidate_id_fkey"
  FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "recruitments"
  ADD CONSTRAINT "recruitments_vacancy_id_fkey"
  FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "recruitments"
  ADD CONSTRAINT "recruitments_created_by_fkey"
  FOREIGN KEY ("created_by") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "recruitment_stages"
  ADD CONSTRAINT "recruitment_stages_recruitment_id_fkey"
  FOREIGN KEY ("recruitment_id") REFERENCES "recruitments"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "recruitment_stages"
  ADD CONSTRAINT "recruitment_stages_assigned_user_id_fkey"
  FOREIGN KEY ("assigned_user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
