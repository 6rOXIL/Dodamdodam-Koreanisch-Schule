-- 코리안넷 공지 스크래핑 저장 (최근 10건, 공개 읽기)
create table public.public_notices (
  id uuid primary key default gen_random_uuid(),
  board_no text not null unique,
  legacy_url text not null,
  title text not null,
  body_html text not null default '',
  author text,
  published_at date not null,
  attachments jsonb not null default '[]'::jsonb,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index public_notices_published_at_idx
  on public.public_notices (published_at desc);

create trigger public_notices_updated_at
  before update on public.public_notices
  for each row execute function public.set_updated_at();

alter table public.public_notices enable row level security;

create policy "public_notices_select_public"
  on public.public_notices for select
  to anon, authenticated
  using (true);
