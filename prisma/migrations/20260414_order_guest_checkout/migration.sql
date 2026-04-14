-- Make userId nullable and add guest contact columns on orders
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;

ALTER TABLE "orders"
  ADD COLUMN "guest_email" TEXT,
  ADD COLUMN "guest_name"  TEXT,
  ADD COLUMN "guest_phone" TEXT;
