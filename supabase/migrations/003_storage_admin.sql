-- ============================================================
-- Migration 003: BOQ storage bucket, staff access helpers
-- ============================================================

-- Private bucket for BOQ uploads (written by the server with the service role)
insert into storage.buckets (id, name, public)
values ('boq', 'boq', false)
on conflict (id) do nothing;

-- Staff can read their own staff_users row (used by the admin login check)
create policy "staff read self" on staff_users for select using (auth.uid() = id);

-- Products need an updated timestamp for admin edits / sitemap
alter table products add column if not exists updated_at timestamptz default now();
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

-- Keep prices.updated_at current on every price change (PR-3 stale alert)
create trigger prices_updated_at before update on prices
  for each row execute function set_updated_at();
