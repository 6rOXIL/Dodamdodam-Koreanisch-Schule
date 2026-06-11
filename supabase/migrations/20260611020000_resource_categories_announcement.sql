-- 「안내」→「수업안내」 이름 변경, 「공지」 카테고리 추가
update public.resource_categories
set name_ko = '수업안내'
where slug = 'notice';

insert into public.resource_categories (slug, name_ko, sort_order) values
  ('announcement', '공지', 4)
on conflict (slug) do nothing;
