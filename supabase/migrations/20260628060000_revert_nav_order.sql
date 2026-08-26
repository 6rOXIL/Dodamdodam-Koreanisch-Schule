-- 카테고리 순서 직전 상태로 복구
-- 학교 소개 → 학급 소개 → 반별 커리큘럼 → 갤러리 → 학교 소식 → 입학안내 → 수업료 안내 → 오시는 길

update public.site_nav_items set sort_order = 0, is_visible = false where slug = 'home';
update public.site_nav_items set sort_order = 1, is_visible = true where slug = 'about';
update public.site_nav_items set sort_order = 2, is_visible = true where slug = 'classes';
update public.site_nav_items set sort_order = 3, is_visible = true where slug = 'schedule';
update public.site_nav_items set sort_order = 4, is_visible = true where slug = 'gallery';
update public.site_nav_items set sort_order = 5, is_visible = true where slug = 'events';
update public.site_nav_items set sort_order = 6, is_visible = true where slug = 'enrollment';
update public.site_nav_items set sort_order = 7, is_visible = true where slug = 'tuition';
update public.site_nav_items set sort_order = 8, is_visible = true where slug = 'location';
