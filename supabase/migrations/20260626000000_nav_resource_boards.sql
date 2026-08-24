-- ---------------------------------------------------------------------------
-- 사이트 메뉴에 자료실 연동된 분류만 공개 게시판으로 읽기
-- (기존 notice / announcement 슬러그 하드코딩 정책 대체)
-- ---------------------------------------------------------------------------

drop policy if exists "resources_select_notice_published_public" on public.resources;
drop policy if exists "resources_select_announcement_published_public" on public.resources;
drop policy if exists "storage_class_materials_select_notice_published" on storage.objects;
drop policy if exists "storage_class_materials_select_announcement_published" on storage.objects;

create policy "resources_select_nav_board_published_public"
  on public.resources for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1
      from public.resource_categories c
      inner join public.site_nav_items n
        on n.content_kind = 'resources:' || c.slug
      where c.id = resources.category_id
    )
  );

create policy "storage_class_materials_select_nav_board_published"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'class-materials'
    and exists (
      select 1
      from public.resources r
      inner join public.resource_categories c on c.id = r.category_id
      inner join public.site_nav_items n
        on n.content_kind = 'resources:' || c.slug
      where r.storage_path = storage.objects.name
        and r.is_published = true
    )
  );

-- 고정 슬러그 전용 가드 → 메뉴에 연동된 분류만 삭제/슬러그 변경 차단
drop trigger if exists resource_categories_guard_fixed_insert on public.resource_categories;
drop function if exists public.guard_fixed_resource_category_insert();

create or replace function public.guard_fixed_resource_categories()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    if exists (
      select 1
      from public.site_nav_items n
      where n.content_kind = 'resources:' || old.slug
    ) then
      raise exception 'cannot delete resource category linked from site menu: %', old.slug;
    end if;
    return old;
  end if;

  if new.slug is distinct from old.slug
    and exists (
      select 1
      from public.site_nav_items n
      where n.content_kind = 'resources:' || old.slug
    ) then
    raise exception 'cannot rename resource category slug linked from site menu: %', old.slug;
  end if;

  return new;
end;
$$;
