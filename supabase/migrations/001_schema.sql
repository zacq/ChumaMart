-- ============================================================
-- Migration 001: ChumaMart v2 schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";
create extension if not exists "postgis";   -- for delivery zone polygons

-- ============================================================
-- Categories
-- ============================================================
create table if not exists categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  intro_text   text,
  tile_image   text,
  sort_order   int default 0,
  filter_schema jsonb default '{}',
  created_at   timestamptz default now()
);

-- ============================================================
-- Products
-- ============================================================
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references categories(id) on delete set null,
  name         text not null,
  slug         text unique not null,
  brand        text,
  size_grade   text,
  unit         text not null,
  specs        jsonb default '{}',
  photos       text[] default '{}',
  related_ids  uuid[] default '{}',
  stock_status text not null default 'in_stock'
               check (stock_status in ('in_stock','low','on_order','out_of_stock')),
  featured     bool default false,
  search_text  tsvector generated always as (
                 to_tsvector('english', coalesce(name,'') || ' ' ||
                 coalesce(brand,'') || ' ' || coalesce(size_grade,'') || ' ' ||
                 coalesce(unit,''))
               ) stored,
  created_at   timestamptz default now()
);
create index if not exists products_search_idx on products using gin(search_text);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_featured_idx on products(featured) where featured = true;

-- ============================================================
-- Prices
-- ============================================================
create table if not exists prices (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade unique,
  unit_price  numeric(10,2) not null,
  tiers       jsonb default '[]',   -- [{min_qty:50,price:530},{min_qty:200,price:510}]
  offer_price numeric(10,2),
  offer_start date,
  offer_end   date,
  updated_at  timestamptz default now()
);
create index if not exists prices_product_idx on prices(product_id);
create index if not exists prices_updated_idx on prices(updated_at);

-- ============================================================
-- Customers
-- ============================================================
create table if not exists customers (
  id               uuid primary key default gen_random_uuid(),
  phone            text unique not null,
  name             text,
  email            text,
  trade_account    bool default false,
  default_location text,
  created_at       timestamptz default now()
);

-- ============================================================
-- Quote / Orders (unified record — a paid quote becomes an order)
-- ============================================================
create table if not exists quote_orders (
  id              uuid primary key default gen_random_uuid(),
  ref_no          text unique not null,
  customer_id     uuid references customers(id),
  lines           jsonb not null default '[]',
  -- Each line: {product_id, name, unit, qty, unit_price, subtotal}
  boq_files       text[] default '{}',
  location_text   text,
  location_lat    double precision,
  location_lng    double precision,
  in_nakuru_town  bool,
  delivery_charge numeric(10,2) default 0,
  deposit_pct     int default 0,
  total           numeric(10,2),
  validity_date   date,
  status          text not null default 'quote_requested'
                  check (status in (
                    'quote_requested','quote_sent','paid_deposit',
                    'paid_full','scheduled','dispatched','delivered',
                    'expired','cancelled')),
  pay_link_token  uuid default gen_random_uuid(),
  source          text default 'web' check (source in ('web','whatsapp','staff')),
  notes           text,
  staff_notes     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists qo_customer_idx on quote_orders(customer_id);
create index if not exists qo_status_idx   on quote_orders(status);
create index if not exists qo_token_idx    on quote_orders(pay_link_token);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger qo_updated_at before update on quote_orders
  for each row execute function set_updated_at();

-- ============================================================
-- Payments
-- ============================================================
create table if not exists payments (
  id              uuid primary key default gen_random_uuid(),
  quote_order_id  uuid references quote_orders(id) on delete cascade,
  amount          numeric(10,2) not null,
  type            text not null check (type in ('deposit','balance','full')),
  mpesa_receipt   text,
  mpesa_phone     text,
  checkout_request_id text,
  status          text not null default 'pending'
                  check (status in ('pending','confirmed','failed')),
  paid_at         timestamptz,
  created_at      timestamptz default now()
);
create index if not exists payments_qo_idx     on payments(quote_order_id);
create index if not exists payments_receipt_idx on payments(mpesa_receipt);
create index if not exists payments_cr_idx      on payments(checkout_request_id);

-- ============================================================
-- Deliveries
-- ============================================================
create table if not exists deliveries (
  id              uuid primary key default gen_random_uuid(),
  quote_order_id  uuid references quote_orders(id) on delete cascade,
  delivery_date   date,
  time_window     text,
  vehicle         text,
  driver_name     text,
  driver_phone    text,
  status          text not null default 'scheduled'
                  check (status in ('scheduled','dispatched','delivered')),
  dispatched_at   timestamptz,
  delivered_at    timestamptz,
  created_at      timestamptz default now()
);

-- ============================================================
-- Delivery zones
-- ============================================================
create table if not exists delivery_zones (
  id      uuid primary key default gen_random_uuid(),
  name    text not null,
  areas   text[] default '{}',  -- plain text area names for dropdown matching
  free    bool default false,
  rate    numeric(10,2),         -- Phase 2
  sort_order int default 0
);

-- Seed Nakuru town zone (OQ-1 placeholder — update with real areas)
insert into delivery_zones (name, areas, free) values (
  'Nakuru Town',
  ARRAY[
    'Nakuru Town','Milimani','Section 58','Barnabas','Free Area','Flamingo',
    'London','Rhonda','Lanet','Racecourse','Kivumbini','Pipeline','Pangani',
    'Naka','Kapkures','Freehold','Shabab','Bondeni','Nakuru Industrial Area',
    'Mwariki','Kaptembwa','Afraha','Biashara','Westside Mall Area',
    'Nakumatt Roundabout Area','Westside','Mabatini','Langa Langa'
  ],
  true
) on conflict do nothing;

-- ============================================================
-- Calculator config
-- ============================================================
create table if not exists calculator_configs (
  id           uuid primary key default gen_random_uuid(),
  calculator   text unique not null,
  ratios       jsonb default '{}',
  wastage_pct  numeric(5,2) default 10,
  mappings     jsonb default '{}'
);

-- Seed default configs
insert into calculator_configs (calculator, ratios, wastage_pct, mappings) values
('concrete', '{"mix_1_2_4":{"cement":1,"sand":2,"ballast":4},"mix_1_3_6":{"cement":1,"sand":3,"ballast":6}}', 10, '{}'),
('roofing',  '{"sheets_per_metre":1,"ridge_every_metres":3}', 10, '{}'),
('paint',    '{"coverage_sqm_per_litre":8}', 10, '{}'),
('steel',    '{"binding_wire_per_tonne_bars":2}', 5, '{}'),
('tank',     '{"litres_per_person_per_day":50}', 0, '{}'),
('blockwork','{"blocks_per_sqm_200x400":12.5,"mortar_bags_per_sqm":0.5}', 10, '{}')
on conflict (calculator) do nothing;

-- ============================================================
-- Reviews
-- ============================================================
create table if not exists reviews (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid references customers(id),
  order_id     uuid references quote_orders(id),
  rating       int check (rating between 1 and 5),
  review_text  text,
  town         text,
  verified     bool default false,
  created_at   timestamptz default now()
);

-- ============================================================
-- Staff users (extends auth.users)
-- ============================================================
create table if not exists staff_users (
  id    uuid primary key references auth.users(id) on delete cascade,
  role  text not null check (role in ('owner','sales','dispatch','content')),
  name  text
);

-- ============================================================
-- Audit log
-- ============================================================
create table if not exists audit_log (
  id         uuid primary key default gen_random_uuid(),
  staff_id   uuid references staff_users(id),
  action     text not null,
  table_name text,
  record_id  uuid,
  old_data   jsonb,
  new_data   jsonb,
  created_at timestamptz default now()
);
create index if not exists audit_created_idx on audit_log(created_at desc);

-- ============================================================
-- Row Level Security policies
-- ============================================================

-- Public read on categories and products
alter table categories  enable row level security;
alter table products    enable row level security;
alter table prices      enable row level security;
alter table delivery_zones enable row level security;
alter table calculator_configs enable row level security;
alter table reviews     enable row level security;

create policy "public read categories"  on categories  for select using (true);
create policy "public read products"    on products    for select using (true);
create policy "public read prices"      on prices      for select using (true);
create policy "public read zones"       on delivery_zones for select using (true);
create policy "public read calc config" on calculator_configs for select using (true);
create policy "public read reviews"     on reviews     for select using (verified = true);

-- Staff full access via service role (server-side API routes use service key)
-- Customers: authenticated only
alter table customers     enable row level security;
alter table quote_orders  enable row level security;
alter table payments      enable row level security;
alter table deliveries    enable row level security;
alter table staff_users   enable row level security;
alter table audit_log     enable row level security;

-- Customers can read their own record (by phone via JWT claim, handled server-side)
-- All writes from API routes use the service role key, so RLS is bypassed there
