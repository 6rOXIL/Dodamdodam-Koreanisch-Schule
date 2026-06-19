-- 고정 분류: 수업안내(notice), 학교소식(announcement)
update public.resource_categories
set name_ko = '학교소식'
where slug = 'announcement';

-- 정렬: 학교소식(1) → 수업안내(2) → 수업 자료(3) → 숙제(4)
-- (고정 분류 트리거 적용 전에 설정해야 함)
update public.resource_categories set sort_order = 1 where slug = 'announcement';
update public.resource_categories set sort_order = 2 where slug = 'notice';
update public.resource_categories set sort_order = 3 where slug = 'handout';
update public.resource_categories set sort_order = 4 where slug = 'homework';

-- 학교소식: 공개 자료·파일 읽기 (수업안내와 동일 패턴)
create policy "resources_select_announcement_published_public"
  on public.resources for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1
      from public.resource_categories c
      where c.id = resources.category_id
        and c.slug = 'announcement'
    )
  );

create policy "storage_class_materials_select_announcement_published"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'class-materials'
    and exists (
      select 1
      from public.resources r
      inner join public.resource_categories c on c.id = r.category_id
      where r.storage_path = storage.objects.name
        and r.is_published = true
        and c.slug = 'announcement'
    )
  );

-- 고정 분류 수정·삭제 방지
create or replace function public.guard_fixed_resource_categories()
returns trigger
language plpgsql
as $$
begin
  if old.slug in ('notice', 'announcement') then
    raise exception 'cannot modify fixed resource category: %', old.slug;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger resource_categories_guard_fixed_update
  before update on public.resource_categories
  for each row execute function public.guard_fixed_resource_categories();

create trigger resource_categories_guard_fixed_delete
  before delete on public.resource_categories
  for each row execute function public.guard_fixed_resource_categories();

create or replace function public.guard_fixed_resource_category_insert()
returns trigger
language plpgsql
as $$
begin
  if new.slug in ('notice', 'announcement') then
    raise exception 'cannot create fixed resource category slug: %', new.slug;
  end if;
  return new;
end;
$$;

create trigger resource_categories_guard_fixed_insert
  before insert on public.resource_categories
  for each row execute function public.guard_fixed_resource_category_insert();
