// SQL schema for Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  username text unique,
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Customizations table
create table if not exists customizations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text,
  data jsonb not null,
  car_id text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Indexes
create index if not exists idx_customizations_user_id on customizations(user_id);
create index if not exists idx_customizations_created_at on customizations(created_at);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table customizations enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can view own customizations" on customizations
  for select using (auth.uid() = user_id);

create policy "Users can create customizations" on customizations
  for insert with check (auth.uid() = user_id);

create policy "Users can update own customizations" on customizations
  for update using (auth.uid() = user_id);

create policy "Users can delete own customizations" on customizations
  for delete using (auth.uid() = user_id);
