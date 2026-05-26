-- Execute no SQL Editor do Supabase
create table if not exists public.finance_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  salario numeric(12,2) not null default 0,
  valor_extra_base numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gastos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  descricao text not null,
  valor numeric(12,2) not null,
  data timestamptz not null,
  categoria text not null,
  status text not null check (status in ('pago','pendente')),
  created_at timestamptz not null default now()
);

create table if not exists public.extras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  descricao text not null,
  valor numeric(12,2) not null,
  data timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.finance_data enable row level security;
alter table public.gastos enable row level security;
alter table public.extras enable row level security;

drop policy if exists "finance_data_owner_all" on public.finance_data;
create policy "finance_data_owner_all" on public.finance_data
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "gastos_owner_all" on public.gastos;
create policy "gastos_owner_all" on public.gastos
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "extras_owner_all" on public.extras;
create policy "extras_owner_all" on public.extras
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists finance_data_updated_at on public.finance_data;
create trigger finance_data_updated_at
before update on public.finance_data
for each row execute function public.set_updated_at();
