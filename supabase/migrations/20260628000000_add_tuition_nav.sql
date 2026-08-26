-- 상단 메뉴: 「수업료 안내」를 입학·수강 신청 다음에 추가

alter table public.site_page_contents
  drop constraint if exists site_page_contents_page_slug_check;

alter table public.site_page_contents
  add constraint site_page_contents_page_slug_check
  check (
    page_slug in (
      'home',
      'introduction',
      'classes',
      'schedule',
      'gallery',
      'events',
      'location',
      'tuition'
    )
  );

insert into public.site_nav_items
  (slug, href_path, label_ko, label_en, label_de, sort_order, content_kind, is_visible)
values
  ('tuition', '/tuition/', '수업료 안내', 'Tuition', 'Gebühren', 9, 'static', true)
on conflict (slug) do update
set
  href_path = excluded.href_path,
  label_ko = excluded.label_ko,
  label_en = excluded.label_en,
  label_de = excluded.label_de,
  sort_order = excluded.sort_order,
  content_kind = excluded.content_kind,
  is_visible = excluded.is_visible;
