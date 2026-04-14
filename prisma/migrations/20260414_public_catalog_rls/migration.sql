-- Public SELECT policies for catalog tables so unauthenticated clients can
-- browse products/tags through Supabase. Mutations keep going through the
-- Nest backend using the service-role key, which bypasses RLS.

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'products',
    'product_sizes',
    'product_modifier_groups',
    'product_modifiers',
    'modifier_size_prices',
    'tags',
    'product_tags',
    'product_modifier_tags',
    'banners',
    'sections',
    'section_items',
    'combos',
    'combo_items',
    'stand_products',
    'stands',
    'mood_gallery'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format(
      'DROP POLICY IF EXISTS "public_read_%1$s" ON %1$I;',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY "public_read_%1$s" ON %1$I FOR SELECT USING (true);',
      tbl
    );
  END LOOP;
END
$$;
