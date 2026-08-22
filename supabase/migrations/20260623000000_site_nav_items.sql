-- ---------------------------------------------------------------------------
-- 상단 사이트 메뉴 (홈 ~ 오시는 길)
-- ---------------------------------------------------------------------------

create table public.site_nav_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  href_path text not null,
  label_ko text not null,
  label_en text not null,
  label_de text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  -- pages:introduction | pages:classes | resources:notice | resources:announcement | static
  content_kind text not null default 'static',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_nav_items_sort_order_idx on public.site_nav_items (sort_order);

create trigger site_nav_items_updated_at
  before update on public.site_nav_items
  for each row execute function public.set_updated_at();

alter table public.site_nav_items enable row level security;

create policy "site_nav_items_select_public"
  on public.site_nav_items for select
  to anon, authenticated
  using (true);

create policy "site_nav_items_all_admin"
  on public.site_nav_items for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

insert into public.site_nav_items
  (slug, href_path, label_ko, label_en, label_de, sort_order, content_kind)
values
  ('home', '/', '홈', 'Home', 'Start', 1, 'static'),
  ('about', '/introduction/', '학교 소개', 'About the school', 'Über die Schule', 2, 'pages:introduction'),
  ('classes', '/classes/', '학급 소개', 'Classes', 'Klassen', 3, 'pages:classes'),
  ('schedule', '/schedule/', '수업 안내', 'Class schedule', 'Stundenplan', 4, 'resources:notice'),
  ('gallery', '/gallery/', '갤러리', 'Gallery', 'Galerie', 5, 'static'),
  ('events', '/events/', '학교 소식', 'School news', 'Schulnachrichten', 6, 'resources:announcement'),
  ('location', '/location/', '오시는 길', 'Directions', 'Anfahrt', 7, 'static')
on conflict (slug) do nothing;
