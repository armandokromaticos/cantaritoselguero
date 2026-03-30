-- =============================================
-- Migración: Stand Catalog (N:N) + OrderItem.standId
-- Fecha: 2026-03-26
-- Descripción: Crea tabla stand_products para catálogo operativo N:N.
--              Agrega stand_id nullable a order_items para asignación previa.
-- =============================================

-- PASO 1: Tabla stand_products (catálogo N:N)
CREATE TABLE stand_products (
  stand_id UUID NOT NULL REFERENCES stands(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (stand_id, product_id)
);

CREATE INDEX idx_stand_products_product_id ON stand_products (product_id);

-- PASO 2: Agregar stand_id a order_items
ALTER TABLE order_items ADD COLUMN stand_id UUID REFERENCES stands(id) ON DELETE RESTRICT;

CREATE INDEX idx_order_items_stand_id ON order_items (stand_id);
