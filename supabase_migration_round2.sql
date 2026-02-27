-- ============================================================
-- SANRA LIVING — Round 2 Admin Features Migration
-- Run this in: Supabase > SQL Editor > New Query
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- ADD NEW COLUMNS to products
-- ══════════════════════════════════════════════════════════════
do $$
begin
    -- Sale / Compare-at Price
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'products' and column_name = 'compare_at_price'
    ) then
        alter table public.products add column compare_at_price numeric(10,2) default null;
    end if;

    -- Weight (kg)
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'products' and column_name = 'weight_kg'
    ) then
        alter table public.products add column weight_kg numeric(6,2) default null;
    end if;

    -- Dimensions (L x W x H as text)
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'products' and column_name = 'dimensions'
    ) then
        alter table public.products add column dimensions text default '';
    end if;

    -- Tags (array of text)
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'products' and column_name = 'tags'
    ) then
        alter table public.products add column tags text[] default '{}';
    end if;

    -- Display order (for manual sorting)
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'products' and column_name = 'display_order'
    ) then
        alter table public.products add column display_order integer default 0;
    end if;
end $$;


-- ══════════════════════════════════════════════════════════════
-- ADD admin_notes to orders
-- ══════════════════════════════════════════════════════════════
do $$
begin
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'orders' and column_name = 'admin_notes'
    ) then
        alter table public.orders add column admin_notes text default '';
    end if;
end $$;

-- Index for display_order sorting
create index if not exists idx_products_display_order on public.products (display_order);
