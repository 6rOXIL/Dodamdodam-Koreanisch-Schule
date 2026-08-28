-- 헤더 메뉴 순서
-- 학교소개 → 입학안내 → 수업료안내 → 오시는 길 → 학급소개 → 반별 커리큘럼 → 학교소식 → 갤러리

update public.site_nav_items set sort_order = 0, is_visible = false where slug = 'home';

update public.site_nav_items
set
  sort_order = 1,
  is_visible = true,
  label_ko = '학교소개'
where slug = 'about';

update public.site_nav_items
set
  sort_order = 2,
  is_visible = true,
  label_ko = '입학안내'
where slug = 'enrollment';

update public.site_nav_items
set
  sort_order = 3,
  is_visible = true,
  label_ko = '수업료안내'
where slug = 'tuition';

update public.site_nav_items
set
  sort_order = 4,
  is_visible = true,
  label_ko = '오시는 길'
where slug = 'location';

update public.site_nav_items
set
  sort_order = 5,
  is_visible = true,
  label_ko = '학급소개'
where slug = 'classes';

update public.site_nav_items
set
  sort_order = 6,
  is_visible = true,
  label_ko = '반별 커리큘럼'
where slug = 'schedule';

update public.site_nav_items
set
  sort_order = 7,
  is_visible = true,
  label_ko = '학교소식'
where slug = 'events';

update public.site_nav_items
set
  sort_order = 8,
  is_visible = true,
  label_ko = '갤러리'
where slug = 'gallery';
