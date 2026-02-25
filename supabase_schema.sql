-- ============================================================
-- SANRA LIVING — Supabase SQL Schema
-- Run this entire block in: Supabase > SQL Editor > New Query
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════════════════════════════
-- TABLE: products
-- ══════════════════════════════════════════════════════════════
create table if not exists public.products (
    id              uuid primary key default uuid_generate_v4(),
    title           text            not null,
    subtitle        text            not null default '',
    price           numeric(10,2)   not null,
    category        text            not null,
    finish          text            not null default 'Matte Black',
    stock_status    text            not null default 'In Stock',
    stock_qty       integer         not null default 99,
    image_url       text            not null default '',
    hover_image_url text            not null default '',
    is_new          boolean         not null default false,
    is_active       boolean         not null default true,
    description     text,
    created_at      timestamptz     not null default now(),
    updated_at      timestamptz     not null default now()
);

-- Indexes
create index if not exists idx_products_category  on public.products (category);
create index if not exists idx_products_is_active  on public.products (is_active);
create index if not exists idx_products_created_at on public.products (created_at desc);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
    before update on public.products
    for each row execute function public.set_updated_at();

-- RLS
alter table public.products enable row level security;

-- Anyone can read active products (used by /api/products which runs server-side with service role — still safe)
create policy "Public read active products"
    on public.products for select
    using (is_active = true);


-- ══════════════════════════════════════════════════════════════
-- TABLE: orders
-- ══════════════════════════════════════════════════════════════
create table if not exists public.orders (
    id                  uuid primary key default uuid_generate_v4(),
    order_number        text            not null unique,
    user_email          text,
    user_phone          text,
    shipping_address    text,
    city                text,
    state               text,
    pincode             text,
    payment_method      text            not null default 'prepaid',   -- 'prepaid' | 'cod'
    payment_status      text            not null default 'pending',   -- 'pending' | 'paid' | 'failed'
    order_status        text            not null default 'processing',
    -- 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
    total_amount        numeric(10,2)   not null default 0,
    advance_paid        numeric(10,2)   not null default 0,
    remaining_amount    numeric(10,2)   not null default 0,
    razorpay_payment_id text,
    created_at          timestamptz     not null default now(),
    updated_at          timestamptz     not null default now()
);

create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_user_phone   on public.orders (user_phone);
create index if not exists idx_orders_created_at   on public.orders (created_at desc);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
    before update on public.orders
    for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

-- Only the service-role key (used by API routes) can read/write orders
-- No public select policy — all access goes through API routes using supabaseAdmin


-- ══════════════════════════════════════════════════════════════
-- TABLE: order_items
-- ══════════════════════════════════════════════════════════════
create table if not exists public.order_items (
    id           uuid primary key default uuid_generate_v4(),
    order_id     uuid            not null references public.orders (id) on delete cascade,
    product_id   text            not null,   -- UUID string of product
    product_name text            not null,
    quantity     integer         not null default 1,
    unit_price   numeric(10,2)   not null,
    total_price  numeric(10,2)   not null,
    created_at   timestamptz     not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);

alter table public.order_items enable row level security;


-- ══════════════════════════════════════════════════════════════
-- TABLE: order_status_logs
-- ══════════════════════════════════════════════════════════════
create table if not exists public.order_status_logs (
    id         uuid primary key default uuid_generate_v4(),
    order_id   uuid            not null references public.orders (id) on delete cascade,
    status     text            not null,
    updated_at timestamptz     not null default now()
);

create index if not exists idx_order_status_logs_order_id on public.order_status_logs (order_id);

alter table public.order_status_logs enable row level security;


-- ══════════════════════════════════════════════════════════════
-- TABLE: contact_messages
-- ══════════════════════════════════════════════════════════════
create table if not exists public.contact_messages (
    id         uuid primary key default uuid_generate_v4(),
    full_name  text            not null,
    email      text            not null,
    phone      text,
    subject    text,
    message    text            not null,
    created_at timestamptz     not null default now()
);

create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;


-- ══════════════════════════════════════════════════════════════
-- TABLE: bulk_enquiries
-- ══════════════════════════════════════════════════════════════
create table if not exists public.bulk_enquiries (
    id               uuid primary key default uuid_generate_v4(),
    company_name     text,
    contact_person   text            not null,
    phone            text            not null,
    email            text,
    city             text,
    product_interest text,
    quantity         integer,
    message          text,
    created_at       timestamptz     not null default now()
);

create index if not exists idx_bulk_enquiries_created_at on public.bulk_enquiries (created_at desc);

alter table public.bulk_enquiries enable row level security;


-- ══════════════════════════════════════════════════════════════
-- FUNCTION: decrement_stock
-- Called by verify-payment API after successful payment
-- ══════════════════════════════════════════════════════════════
create or replace function public.decrement_stock(
    p_product_id text,
    p_qty        integer
)
returns void language plpgsql security definer as $$
begin
    update public.products
    set
        stock_qty    = greatest(0, stock_qty - p_qty),
        stock_status = case
                            when greatest(0, stock_qty - p_qty) = 0 then 'Out of Stock'
                            when greatest(0, stock_qty - p_qty) <= 3 then 'Only 3 Left'
                            when greatest(0, stock_qty - p_qty) <= 12 then 'Only 12 Left'
                            else stock_status
                       end,
        updated_at   = now()
    where id = p_product_id::uuid;
end;
$$;


-- ══════════════════════════════════════════════════════════════
-- SEED DATA — Initial Products (optional — you can add more
-- from the Admin page at /admin after setup)
-- ══════════════════════════════════════════════════════════════
insert into public.products
    (title, subtitle, price, category, finish, stock_status, stock_qty, image_url, hover_image_url, is_new, is_active, description)
values
    ('SL Edge',     'Entryway Steel Organizer',          2499,  'Entryway Storage', 'Matte Black',  'In Stock',     12, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80', false, true, 'SL Edge is designed for modern entryways and compact homes. Crafted from structural-grade steel and finished in matte powder coating, it delivers durability without compromising aesthetics.'),
    ('SL Apex',     'Wall-Mount Study Desk',             5499,  'Study Desks',      'Graphite Grey','Only 12 Left', 12, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80', false, true, 'SL Apex wall-mount desk transforms any vertical wall into a functional workspace. Engineered from 1.5mm structural steel with a graphite grey finish.'),
    ('SL Vault',    'Modular Wall Storage System',       8999,  'Wall Storage',     'Matte Black',  'In Stock',     20, 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&q=80', true,  true, 'SL Vault is a fully modular wall storage system designed for living rooms, studies, and offices.'),
    ('SL Crest',    'Steel Magazine & Key Holder',       1299,  'Entryway Storage', 'Graphite Grey','New',          30, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', true,  true, 'SL Crest is a compact entryway essential — magazine rack, key hooks, and mail organiser all in one clean steel frame.'),
    ('SL Slate',    'Standing Study Desk – Height Adjust',12999,'Study Desks',      'Matte Black',  'Only 3 Left',  3,  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', false, true, 'SL Slate is a height-adjustable standing desk engineered for long work sessions.'),
    ('SL Grid',     'Pegboard Wall Storage',             3499,  'Wall Storage',     'Graphite Grey','In Stock',     25, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80', false, true, 'SL Grid is a perforated steel pegboard system that turns any wall into an organised, customisable storage surface.'),
    ('SL Mono',     'Minimalist Entryway Shelf',         1899,  'Entryway Storage', 'Matte Black',  'Limited',      8,  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', false, true, 'SL Mono is a single-shelf floating steel shelf designed for pure simplicity.'),
    ('SL Frame',    'Wall Display Frame Storage',        6299,  'Wall Storage',     'Graphite Grey','In Stock',     15, 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80', 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=600&q=80', false, true, 'SL Frame combines display and storage in a single wall-mounted steel frame.'),
    ('SL Pro Desk', 'Corner Steel Study Station',        9499,  'Study Desks',      'Matte Black',  'New',          20, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80', 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80', true,  true, 'SL Pro Desk is a full-corner study station built for serious work environments.')
on conflict do nothing;
