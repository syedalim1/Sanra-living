-- =====================================================
-- SANRA LIVING — Round 3 Migration: Product Videos
-- Run this in Supabase SQL Editor AFTER round 1 & 2
-- =====================================================

-- ── 1. Add video columns to products table ──
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS video_thumbnail TEXT DEFAULT '';

-- ── 2. Add product_media table for flexible media management ──
CREATE TABLE IF NOT EXISTS product_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL,
    thumbnail_url TEXT DEFAULT '',
    public_id TEXT DEFAULT '',         -- Cloudinary public_id for deletion
    display_order INTEGER DEFAULT 0,
    alt_text TEXT DEFAULT '',
    width INTEGER DEFAULT 0,
    height INTEGER DEFAULT 0,
    duration_seconds NUMERIC DEFAULT 0,  -- video duration
    file_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast product lookup
CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_order ON product_media(product_id, display_order);

-- ── 3. RLS policies for product_media ──
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can read product_media" ON product_media
    FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service role can manage product_media" ON product_media
    FOR ALL USING (true) WITH CHECK (true);

-- ── Done ──
-- After running, add these env vars if not already set:
--   CLOUDINARY_CLOUD_NAME=xxx
--   CLOUDINARY_API_KEY=xxx
--   CLOUDINARY_API_SECRET=xxx
