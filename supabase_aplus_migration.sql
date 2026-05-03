-- ============================================================
-- SANRA LIVING — A+ Content Table Migration
-- Run this in: Supabase > SQL Editor > New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_aplus_content (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title       text NOT NULL DEFAULT '',
    description text NOT NULL DEFAULT '',
    image_url   text NOT NULL DEFAULT '',
    position    integer NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aplus_product_id ON public.product_aplus_content(product_id);
CREATE INDEX IF NOT EXISTS idx_aplus_position ON public.product_aplus_content(product_id, position);

ALTER TABLE public.product_aplus_content ENABLE ROW LEVEL SECURITY;

-- Public can read A+ content (displayed on product pages)
CREATE POLICY "Public read aplus content"
    ON public.product_aplus_content FOR SELECT
    USING (true);
