CREATE TABLE "candidates" (
  "id" TEXT NOT NULL,
  "full_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone_number" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");
