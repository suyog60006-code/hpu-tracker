-- HPU Tracker Schema
-- Run this in Supabase SQL Editor

-- Projects table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  oa_number text not null,
  customer text not null,
  project_type text not null check (project_type in ('integration', 'fabrication')),
  created_at timestamptz default now()
);

-- Cards table
create table if not exists cards (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  card_type text not null,
  scope text not null default 'my_scope' check (scope in ('my_scope', 'client_scope')),
  stage text not null default 'backlog',
  bom_ref text,
  make_model text,
  qty integer,
  notes text,
  has_flag boolean default false,
  checklist jsonb default '[]',
  comments jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on cards
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cards_updated_at
  before update on cards
  for each row execute function update_updated_at();

-- Enable Row Level Security
alter table projects enable row level security;
alter table cards enable row level security;

-- Policies: allow all authenticated users full access (we'll tighten per-role after auth setup)
create policy "Authenticated users can read projects"
  on projects for select to authenticated using (true);

create policy "Authenticated users can insert projects"
  on projects for insert to authenticated with check (true);

create policy "Authenticated users can update projects"
  on projects for update to authenticated using (true);

create policy "Authenticated users can read cards"
  on cards for select to authenticated using (true);

create policy "Authenticated users can insert cards"
  on cards for insert to authenticated with check (true);

create policy "Authenticated users can update cards"
  on cards for update to authenticated using (true);
