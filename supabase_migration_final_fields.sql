-- ============================================================
-- SANRA LIVING — Final Recommended Input Fields Migration
-- Run this in: Supabase > SQL Editor > New Query
-- ============================================================

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS sku TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS material TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS steel_thickness TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS dimensions TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS dispatch_time TEXT DEFAULT '2-5 Business Days',
    ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS whatsapp_message TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS slug TEXT DEFAULT '';
