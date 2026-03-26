-- =============================================
-- Migración: i18n + Tags + Sections
-- Fecha: 2026-03-24
-- Descripción: Agrega soporte bilingüe (Es/En) a productos, combos y sub-entidades.
--              Crea sistema de tags y secciones dinámicas.
-- IMPORTANTE: Ejecutar manualmente en orden. Todos los campos _en son nullable.
-- =============================================

-- =============================================
-- PASO 1: i18n en Product
-- =============================================
ALTER TABLE products RENAME COLUMN name TO name_es;
ALTER TABLE products ADD COLUMN name_en TEXT;
ALTER TABLE products RENAME COLUMN description TO description_es;
ALTER TABLE products ADD COLUMN description_en TEXT;

-- =============================================
-- PASO 2: i18n en ProductSize
-- =============================================
ALTER TABLE product_sizes RENAME COLUMN name TO name_es;
ALTER TABLE product_sizes ADD COLUMN name_en TEXT;

-- =============================================
-- PASO 3: i18n en ProductModifierGroup
-- =============================================
ALTER TABLE product_modifier_groups RENAME COLUMN name TO name_es;
ALTER TABLE product_modifier_groups ADD COLUMN name_en TEXT;
ALTER TABLE product_modifier_groups RENAME COLUMN description TO description_es;
ALTER TABLE product_modifier_groups ADD COLUMN description_en TEXT;

-- =============================================
-- PASO 4: i18n en ProductModifier
-- =============================================
ALTER TABLE product_modifiers RENAME COLUMN name TO name_es;
ALTER TABLE product_modifiers ADD COLUMN name_en TEXT;

-- =============================================
-- PASO 5: i18n en Combo
-- =============================================
ALTER TABLE combos RENAME COLUMN name TO name_es;
ALTER TABLE combos ADD COLUMN name_en TEXT;
ALTER TABLE combos RENAME COLUMN description TO description_es;
ALTER TABLE combos ADD COLUMN description_en TEXT;

-- =============================================
-- PASO 6: Tags
-- =============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es TEXT NOT NULL UNIQUE,
  name_en TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_tags (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX idx_product_tags_tag_id ON product_tags (tag_id);

-- =============================================
-- PASO 7: Sections
-- =============================================
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  "order" INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE section_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  combo_id UUID REFERENCES combos(id) ON DELETE CASCADE,
  "order" INT NOT NULL DEFAULT 0,
  CONSTRAINT uq_section_product UNIQUE (section_id, product_id),
  CONSTRAINT uq_section_combo UNIQUE (section_id, combo_id),
  CONSTRAINT chk_product_or_combo CHECK (
    (product_id IS NOT NULL AND combo_id IS NULL) OR
    (product_id IS NULL AND combo_id IS NOT NULL)
  )
);

CREATE INDEX idx_section_items_section_order ON section_items (section_id, "order");
CREATE INDEX idx_section_items_product_id ON section_items (product_id);
CREATE INDEX idx_section_items_combo_id ON section_items (combo_id);
