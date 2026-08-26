-- 「수업료 안내」를 「입학·수강 신청」 바로 다음으로 배치
-- (어드민에서 메뉴가 재정렬된 상태 기준)

update public.site_nav_items set sort_order = 9 where slug = 'gallery';
update public.site_nav_items set sort_order = 8 where slug = 'events';
update public.site_nav_items set sort_order = 7 where slug = 'schedule';
update public.site_nav_items set sort_order = 6 where slug = 'classes';
update public.site_nav_items set sort_order = 5 where slug = 'location';
update public.site_nav_items set sort_order = 4 where slug = 'tuition';
