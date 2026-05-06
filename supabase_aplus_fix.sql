-- ============================================================
-- SANRA LIVING — Fix A+ Content Table RLS Policies
-- Run this in: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Ensure the table exists
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

-- 2. Enable RLS
ALTER TABLE public.product_aplus_content ENABLE ROW LEVEL SECURITY;

-- 3. Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Public read aplus content" ON public.product_aplus_content;
DROP POLICY IF EXISTS "Service role full access aplus" ON public.product_aplus_content;

-- 4. Public can READ A+ content (for product pages)
CREATE POLICY "Public read aplus content"
    ON public.product_aplus_content FOR SELECT
    USING (true);

-- 5. Service role can INSERT/UPDATE/DELETE (for admin API)
CREATE POLICY "Service role full access aplus"
    ON public.product_aplus_content FOR ALL
    USING (true)
    WITH CHECK (true);
