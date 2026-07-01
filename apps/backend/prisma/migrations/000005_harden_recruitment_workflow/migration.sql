ALTER TABLE "recruitment_stages"
  ADD CONSTRAINT "recruitment_stages_recruitment_id_stage_key"
  UNIQUE ("recruitment_id", "stage");

CREATE UNIQUE INDEX "recruitment_stages_one_pending_per_recruitment_idx"
  ON "recruitment_stages" ("recruitment_id")
  WHERE "status" = 'PENDING';
