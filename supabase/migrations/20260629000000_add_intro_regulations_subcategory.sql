-- 학교 소개 > 학사규정 하위 메뉴
insert into public.site_subcategories (category_id, slug, label_ko, label_en, label_de, sort_order)
select c.id, 'regulations', '학사규정', 'Academic regulations', 'Schulordnung', 5
from public.site_categories c
where c.slug = 'introduction'
  and not exists (
    select 1
    from public.site_subcategories s
    where s.category_id = c.id and s.slug = 'regulations'
  );
