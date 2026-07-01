CREATE TYPE "RecruitmentDocumentType" AS ENUM ('CV', 'PORTFOLIO');

CREATE TABLE "recruitment_documents" (
  "id" TEXT NOT NULL,
  "recruitment_id" TEXT NOT NULL,
  "document_type" "RecruitmentDocumentType" NOT NULL,
  "original_filename" TEXT NOT NULL,
  "stored_filename" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "storage_provider" TEXT NOT NULL,
  "storage_path" TEXT NOT NULL,
  "uploaded_by" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),

  CONSTRAINT "recruitment_documents_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "recruitment_documents"
  ADD CONSTRAINT "recruitment_documents_recruitment_id_fkey"
  FOREIGN KEY ("recruitment_id") REFERENCES "recruitments"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "recruitment_documents"
  ADD CONSTRAINT "recruitment_documents_uploaded_by_fkey"
  FOREIGN KEY ("uploaded_by") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
