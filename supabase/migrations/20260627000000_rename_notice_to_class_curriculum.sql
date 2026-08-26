-- 자료실·메뉴: 「수업안내」→「반별 커리큘럼」표시명 변경 (slug/path 유지)

update public.resource_categories
set name_ko = '반별 커리큘럼'
where slug = 'notice';

update public.site_nav_items
set
  label_ko = '반별 커리큘럼',
  label_en = 'Class curriculum',
  label_de = 'Klassenlehrplan'
where slug = 'schedule';
