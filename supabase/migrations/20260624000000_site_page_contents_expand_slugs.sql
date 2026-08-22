-- 페이지 본문 슬러그: 사이트 메뉴 전체 카테고리 지원
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
      'location'
    )
  );
