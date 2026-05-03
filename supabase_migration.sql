-- ============================================================
-- SANRA LIVING — Database Migration
-- Run this in: Supabase > SQL Editor > New Query
-- This adds new columns/tables to your existing schema
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- 1. PRODUCTS TABLE — Add missing columns
-- ══════════════════════════════════════════════════════════════

-- Add slug column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;

-- Add sub_category
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sub_category text DEFAULT '';

-- Add material type (SS = Stainless Steel, MS = Mild Steel)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material text DEFAULT 'SS';

-- Add offer_price for discounted pricing
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS offer_price numeric(10,2);

-- Add short_description (for cards/listings)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description text DEFAULT '';

-- Rename existing 'description' to serve as long_description (no action needed, it already exists)

-- Add extra image slots (image_1 to image_5)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_1 text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_2 text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_3 text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_4 text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_5 text DEFAULT '';

-- Add bestseller & new arrival flags
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_best_seller boolean DEFAULT false;
-- is_new already exists in the schema

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);

-- Auto-generate slugs for existing products that don't have one
UPDATE public.products
SET slug = lower(
    regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9 ]', '', 'g'),
        ' +', '-', 'g'
    )
)
WHERE slug IS NULL OR slug = '';


-- ══════════════════════════════════════════════════════════════
-- 2. CATEGORIES TABLE — New
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.categories (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        text NOT NULL,
    slug        text NOT NULL UNIQUE,
    image       text DEFAULT '',
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT USING (true);

-- Seed default categories based on existing product categories
INSERT INTO public.categories (name, slug, image)
SELECT DISTINCT
    category,
    lower(regexp_replace(regexp_replace(category, '[^a-zA-Z0-9 ]', '', 'g'), ' +', '-', 'g')),
    ''
FROM public.products
WHERE category IS NOT NULL AND category != ''
ON CONFLICT (slug) DO NOTHING;


-- ══════════════════════════════════════════════════════════════
-- 3. ORDERS TABLE — Add missing columns
-- ══════════════════════════════════════════════════════════════

-- Add customer_name if it doesn't exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text DEFAULT '';

-- user_phone, shipping_address, city, state, pincode already exist
-- payment_method, payment_status, order_status, total_amount already exist
-- created_at, updated_at already exist


-- ══════════════════════════════════════════════════════════════
-- 4. ORDER_ITEMS TABLE — Already exists, verify columns
-- ══════════════════════════════════════════════════════════════
-- order_id, product_id, product_name, quantity, unit_price, total_price already exist
-- No changes needed


-- ══════════════════════════════════════════════════════════════
-- 5. ADMIN_USERS TABLE — New
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.admin_users (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username    text NOT NULL UNIQUE,
    password    text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- No public access — admin_users accessed only via service role through API

-- Seed a default admin user (change password after first login!)
INSERT INTO public.admin_users (username, password)
VALUES ('admin', 'sanra2024')
ON CONFLICT (username) DO NOTHING;


-- ══════════════════════════════════════════════════════════════
-- 6. BANNERS TABLE — New
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.banners (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       text NOT NULL DEFAULT '',
    image       text NOT NULL DEFAULT '',
    link        text DEFAULT '/',
    is_active   boolean NOT NULL DEFAULT true,
    sort_order  integer NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public can read active banners
CREATE POLICY "Public read active banners" ON public.banners
    FOR SELECT USING (is_active = true);


-- ══════════════════════════════════════════════════════════════
-- SUMMARY OF ALL TABLES
-- ══════════════════════════════════════════════════════════════
--
-- 1. products        — Enhanced with slug, material, offer_price, image_1-5, is_best_seller
-- 2. categories      — NEW — name, slug, image
-- 3. orders          — Enhanced with customer_name
-- 4. order_items     — Already complete (no changes)
-- 5. order_status_logs — Already exists (no changes)
-- 6. admin_users     — NEW — username, password (default: admin/sanra2024)
-- 7. banners         — NEW — title, image, link, is_active, sort_order
-- 8. contact_messages — Already exists (no changes)
-- 9. bulk_enquiries  — Already exists (no changes)
--
-- ============================================================
