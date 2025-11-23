-- Create the table for storing API configurations
create table if not exists user_api_configs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  app_id text,
  app_secret text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table user_api_configs enable row level security;

-- Create policies
create policy "Users can view their own config" on user_api_configs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own config" on user_api_configs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own config" on user_api_configs
  for update using (auth.uid() = user_id);
