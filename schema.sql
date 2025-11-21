-- Create a table for users
create table users (
  id text primary key, -- Whop User ID
  email text,
  name text,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_active timestamp with time zone default timezone('utc'::text, now()) not null,
  streak_days integer default 0,
  points integer default 0
);

-- Create a table for quest progress
create table quest_progress (
  user_id text references users(id) on delete cascade,
  quest_id text not null,
  step_id text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, quest_id, step_id)
);

-- Create a table for daily loot claims
create table daily_loot (
  user_id text references users(id) on delete cascade,
  claimed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reward_type text,
  reward_value integer,
  primary key (user_id, claimed_at)
);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table quest_progress enable row level security;
alter table daily_loot enable row level security;

-- Create policies (simplified for MVP - allow public read/write for now, lock down later)
create policy "Allow public read/write for users" on users for all using (true) with check (true);
create policy "Allow public read/write for quest_progress" on quest_progress for all using (true) with check (true);
create policy "Allow public read/write for daily_loot" on daily_loot for all using (true) with check (true);
