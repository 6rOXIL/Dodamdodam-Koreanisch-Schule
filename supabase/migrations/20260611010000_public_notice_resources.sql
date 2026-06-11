-- 수업안내 게시판: 공개된 「안내」 카테고리 자료·카테고리·파일 읽기
create policy "categories_select_public"
  on public.resource_categories for select
  to anon, authenticated
  using (true);

create policy "resources_select_notice_published_public"
  on public.resources for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1
      from public.resource_categories c
      where c.id = resources.category_id
        and c.slug = 'notice'
    )
  );

create policy "storage_class_materials_select_notice_published"
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
        and c.slug = 'notice'
    )
  );
