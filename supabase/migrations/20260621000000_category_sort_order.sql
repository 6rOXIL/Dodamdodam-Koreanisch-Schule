-- sort_order는 20260620000000_fixed_resource_categories.sql 에서
-- 고정 분류 트리거 적용 전에 이미 설정됩니다.
--
-- 이 파일은 트리거가 먼저 적용된 DB를 위한 보정용입니다.
-- (트리거를 잠시 끄고 sort_order만 갱신한 뒤 다시 켭니다.)

alter table public.resource_categories disable trigger resource_categories_guard_fixed_update;

update public.resource_categories set sort_order = 1 where slug = 'announcement';
update public.resource_categories set sort_order = 2 where slug = 'notice';
update public.resource_categories set sort_order = 3 where slug = 'handout';
update public.resource_categories set sort_order = 4 where slug = 'homework';

alter table public.resource_categories enable trigger resource_categories_guard_fixed_update;
