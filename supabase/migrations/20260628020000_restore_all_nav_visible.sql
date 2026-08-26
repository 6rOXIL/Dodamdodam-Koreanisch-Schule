-- 헤더: 모든 주요 카테고리 표시 (홈은 로고로 이동하므로 숨김)
-- 갤러리 경로 복구

update public.site_nav_items
set
  is_visible = false,
  sort_order = 0
where slug = 'home';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 1,
  href_path = '/introduction/',
  content_kind = 'pages:introduction'
where slug = 'about';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 2,
  href_path = '/classes/',
  content_kind = 'pages:classes'
where slug = 'classes';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 3,
  href_path = '/schedule/',
  content_kind = 'resources:notice'
where slug = 'schedule';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 4,
  href_path = '/gallery/',
  content_kind = 'static',
  label_ko = '갤러리',
  label_en = 'Gallery',
  label_de = 'Galerie'
where slug = 'gallery';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 5,
  href_path = '/events/',
  content_kind = 'resources:announcement'
where slug = 'events';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 6,
  href_path = '/apply/',
  content_kind = 'form:enrollment'
where slug = 'enrollment';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 7,
  href_path = '/tuition/',
  content_kind = 'static'
where slug = 'tuition';

update public.site_nav_items
set
  is_visible = true,
  sort_order = 8,
  href_path = '/location/',
  content_kind = 'static'
where slug = 'location';
