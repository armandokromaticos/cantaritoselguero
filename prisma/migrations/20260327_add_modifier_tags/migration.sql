-- =============================================
-- Migracion: Product Modifier Tags (N:N)
-- Fecha: 2026-03-27
-- Descripcion: Crea tabla product_modifier_tags para asignar
--              etiquetas a modificadores de producto.
-- =============================================

CREATE TABLE product_modifier_tags (
  modifier_id UUID NOT NULL REFERENCES product_modifiers(id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (modifier_id, tag_id)
);
