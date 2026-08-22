-- ---------------------------------------------------------------------------
-- 홈페이지(학교소개·학급소개) 카테고리 / 하위카테고리 / 본문 CMS
-- ---------------------------------------------------------------------------

create table public.site_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label_ko text not null,
  label_en text not null,
  label_de text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.site_subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.site_categories (id) on delete cascade,
  slug text not null,
  label_ko text not null,
  label_en text not null,
  label_de text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index site_categories_sort_order_idx on public.site_categories (sort_order);
create index site_subcategories_category_sort_idx
  on public.site_subcategories (category_id, sort_order);

-- 페이지 전체 본문 (introduction / classes × locale)
create table public.site_page_contents (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null check (page_slug in ('introduction', 'classes')),
  locale text not null check (locale in ('ko', 'en', 'de')),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  unique (page_slug, locale)
);

create index site_page_contents_page_locale_idx
  on public.site_page_contents (page_slug, locale);

create trigger site_page_contents_updated_at
  before update on public.site_page_contents
  for each row execute function public.set_updated_at();

alter table public.site_categories enable row level security;
alter table public.site_subcategories enable row level security;
alter table public.site_page_contents enable row level security;

-- 공개 읽기 (홈페이지 표시용)
create policy "site_categories_select_public"
  on public.site_categories for select
  to anon, authenticated
  using (true);

create policy "site_subcategories_select_public"
  on public.site_subcategories for select
  to anon, authenticated
  using (true);

create policy "site_page_contents_select_public"
  on public.site_page_contents for select
  to anon, authenticated
  using (true);

-- 어드민만 쓰기
create policy "site_categories_all_admin"
  on public.site_categories for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

create policy "site_subcategories_all_admin"
  on public.site_subcategories for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

create policy "site_page_contents_all_admin"
  on public.site_page_contents for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

-- 시드: 카테고리 / 하위카테고리 (슬러그는 라우트와 고정)
insert into public.site_categories (slug, label_ko, label_en, label_de, sort_order) values
  ('introduction', '학교 소개', 'About the school', 'Über die Schule', 1),
  ('classes', '학급 소개', 'Classes', 'Klassen', 2);

insert into public.site_subcategories (category_id, slug, label_ko, label_en, label_de, sort_order)
select c.id, v.slug, v.label_ko, v.label_en, v.label_de, v.sort_order
from public.site_categories c
join (
  values
    ('introduction', 'greeting', '인사말', 'Greeting', 'Grußwort', 1),
    ('introduction', 'summary', '학교소개', 'School overview', 'Schulübersicht', 2),
    ('introduction', 'calendar', '학사일정', 'Academic calendar', 'Schulkalender', 3),
    ('introduction', 'directions', '오시는 길', 'Directions', 'Anfahrt', 4),
    ('classes', 'kindergarten', '유치반', 'Kindergarten', 'Kindergarten', 1),
    ('classes', 'elementary', '초등반', 'Elementary', 'Grundschule', 2),
    ('classes', 'adults', '성인반', 'Adults', 'Erwachsene', 3)
) as v(category_slug, slug, label_ko, label_en, label_de, sort_order)
  on c.slug = v.category_slug;
