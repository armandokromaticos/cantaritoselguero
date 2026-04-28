ALTER TABLE "agency_cards"
  ADD COLUMN "location" TEXT,
  ADD COLUMN "lodging_type" TEXT,
  ADD COLUMN "distance" TEXT;

UPDATE "agency_cards" SET "location" = "value1", "lodging_type" = "value2";

ALTER TABLE "agency_cards"
  ALTER COLUMN "location" SET NOT NULL,
  ALTER COLUMN "lodging_type" SET NOT NULL;

ALTER TABLE "agency_cards"
  DROP COLUMN "label1",
  DROP COLUMN "value1",
  DROP COLUMN "label2",
  DROP COLUMN "value2";
