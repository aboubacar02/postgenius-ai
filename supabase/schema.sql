-- PostGenius AI - Schéma Supabase
-- À exécuter dans l'éditeur SQL de votre projet Supabase.

-- Suivi des crédits journaliers par utilisateur
create table if not exists public.user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null default current_date,
  credits_used int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- Historique des scripts générés
create table if not exists public.generated_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  network text not null,
  topic text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

-- Row Level Security : un utilisateur ne voit que ses données
alter table public.user_credits enable row level security;
alter table public.generated_scripts enable row level security;

-- Abonnements (plan actif par utilisateur)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan text not null default 'Starter',
  provider text,
  reference text,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.subscriptions enable row level security;

create policy "Users read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users insert own subscription"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users update own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- RLS géré par le serveur (webhooks) via la clé service role uniquement

create policy "Users read own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

create policy "Users insert own credits"
  on public.user_credits for insert
  with check (auth.uid() = user_id);

create policy "Users update own credits"
  on public.user_credits for update
  using (auth.uid() = user_id);

create policy "Users read own scripts"
  on public.generated_scripts for select
  using (auth.uid() = user_id);

create policy "Users insert own scripts"
  on public.generated_scripts for insert
  with check (auth.uid() = user_id);
