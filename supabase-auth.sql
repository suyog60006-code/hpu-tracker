-- User roles table
create table if not exists user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  name text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table user_roles enable row level security;

-- Anyone authenticated can read roles (needed to check own role)
create policy "Authenticated can read roles"
  on user_roles for select to authenticated using (true);

-- Only admin can insert/update roles (via service role for now)
create policy "Admin can manage roles"
  on user_roles for all to authenticated
  using (exists (
    select 1 from user_roles where user_id = auth.uid() and role = 'admin'
  ));

-- Drop old anon policies and replace with auth-based ones
drop policy if exists "Anon read projects" on projects;
drop policy if exists "Anon insert projects" on projects;
drop policy if exists "Anon update projects" on projects;
drop policy if exists "Anon read cards" on cards;
drop policy if exists "Anon insert cards" on cards;
drop policy if exists "Anon update cards" on cards;
drop policy if exists "Authenticated users can read projects" on projects;
drop policy if exists "Authenticated users can insert projects" on projects;
drop policy if exists "Authenticated users can update projects" on projects;
drop policy if exists "Authenticated users can read cards" on cards;
drop policy if exists "Authenticated users can insert cards" on cards;
drop policy if exists "Authenticated users can update cards" on cards;

-- Projects: all authenticated users can read
create policy "All users read projects"
  on projects for select to authenticated using (true);

-- Projects: only admin can create
create policy "Admin can create projects"
  on projects for insert to authenticated
  with check (exists (
    select 1 from user_roles where user_id = auth.uid() and role = 'admin'
  ));

-- Projects: only admin can update
create policy "Admin can update projects"
  on projects for update to authenticated
  using (exists (
    select 1 from user_roles where user_id = auth.uid() and role = 'admin'
  ));

-- Cards: all authenticated users can read
create policy "All users read cards"
  on cards for select to authenticated using (true);

-- Cards: admin and editor can insert
create policy "Admin and editor can insert cards"
  on cards for insert to authenticated
  with check (exists (
    select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'editor')
  ));

-- Cards: admin and editor can update
create policy "Admin and editor can update cards"
  on cards for update to authenticated
  using (exists (
    select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'editor')
  ));
