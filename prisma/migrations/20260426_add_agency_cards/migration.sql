-- CreateTable
CREATE TABLE "agency_cards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT,
    "label1" TEXT NOT NULL,
    "value1" TEXT NOT NULL,
    "label2" TEXT NOT NULL,
    "value2" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "social_handle" TEXT,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "tiktok_url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agency_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agency_cards_is_active_idx" ON "agency_cards"("is_active");
