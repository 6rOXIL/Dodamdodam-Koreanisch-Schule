-- 자료실 학급 폴더 (어드민이 관리)
create table public.resource_classes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ko text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index resource_classes_sort_order_idx on public.resource_classes (sort_order);

alter table public.resource_classes enable row level security;

create policy "resource_classes_select_member"
  on public.resource_classes for select
  to authenticated
  using (public.has_role_at_least('member'));

create policy "resource_classes_all_admin"
  on public.resource_classes for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

insert into public.resource_classes (slug, name_ko, sort_order) values
  ('kindergarten', '유치반', 1),
  ('elementary', '초등반', 2),
  ('adults', '성인반', 3)
on conflict (slug) do nothing;
