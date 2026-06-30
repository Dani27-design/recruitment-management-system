CREATE TYPE "VacancyStatus" AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TABLE "vacancies" (
  "id" TEXT NOT NULL,
  "position_name" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "hiring_needed" INTEGER NOT NULL,
  "status" "VacancyStatus" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "vacancies_pkey" PRIMARY KEY ("id")
);
