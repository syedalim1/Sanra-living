-- ============================================================
-- SANRA LIVING — Admin Features Migration
-- Run this in: Supabase > SQL Editor > New Query
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- TABLE: coupons
-- Discount coupons (percentage or flat amount)
-- ══════════════════════════════════════════════════════════════
create table if not exists public.coupons (
    id              uuid primary key default uuid_generate_v4(),
    code            text            not null unique,
    description     text            not null default '',
    discount_type   text            not null default 'percentage',  -- 'percentage' | 'flat'
    discount_value  numeric(10,2)   not null default 0,
    min_order_amount numeric(10,2)  not null default 0,
    max_discount    numeric(10,2),                                  -- cap for percentage discounts
    max_uses        integer         not null default 100,
    used_count      integer         not null default 0,
    is_active       boolean         not null default true,
    starts_at       timestamptz     not null default now(),
    expires_at      timestamptz,
    created_at      timestamptz     not null default now(),
    updated_at      timestamptz     not null default now()
);

create index if not exists idx_coupons_code      on public.coupons (code);
create index if not exists idx_coupons_is_active  on public.coupons (is_active);

drop trigger if exists trg_coupons_updated_at on public.coupons;
create trigger trg_coupons_updated_at
    before update on public.coupons
    for each row execute function public.set_updated_at();

alter table public.coupons enable row level security;


-- ══════════════════════════════════════════════════════════════
-- TABLE: admin_activity_log
-- Tracks admin actions (order updates, product edits, etc.)
-- ══════════════════════════════════════════════════════════════
create table if not exists public.admin_activity_log (
    id          uuid primary key default uuid_generate_v4(),
    action_type text            not null,       -- 'order_status', 'product_edit', 'product_add', 'product_delete', 'coupon_create', 'settings_update', etc.
    description text            not null,
    admin_email text,
    metadata    jsonb           default '{}',   -- extra context (order_id, product_id, etc.)
    created_at  timestamptz     not null default now()
);

create index if not exists idx_activity_log_type       on public.admin_activity_log (action_type);
create index if not exists idx_activity_log_created_at on public.admin_activity_log (created_at desc);

alter table public.admin_activity_log enable row level security;


-- ══════════════════════════════════════════════════════════════
-- TABLE: store_settings
-- Key-value store for admin-configurable settings
-- ══════════════════════════════════════════════════════════════
create table if not exists public.store_settings (
    key         text primary key,
    value       text            not null default '',
    updated_at  timestamptz     not null default now()
);

alter table public.store_settings enable row level security;

-- Seed default settings
insert into public.store_settings (key, value) values
    ('whatsapp_number', '918300904920'),
    ('shipping_charges', '149'),
    ('free_shipping_threshold', '2999'),
    ('business_hours', 'Mon–Sat: 10 AM – 7 PM'),
    ('store_announcement', ''),
    ('support_email', 'support@sanraliving.com')
on conflict (key) do nothing;


-- ══════════════════════════════════════════════════════════════
-- ADD images COLUMN to products (if missing)
-- Some setups may not have it yet
-- ══════════════════════════════════════════════════════════════
do $$
begin
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'products' and column_name = 'images'
    ) then
        alter table public.products add column images text[] default '{}';
    end if;
end $$;
