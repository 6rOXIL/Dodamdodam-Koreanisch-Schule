-- ---------------------------------------------------------------------------
-- 갤러리 사진: public Storage 버킷 + 메타 테이블
-- 어드민에서 업로드·정렬·삭제 → 공개 갤러리 페이지에 표시
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_name text not null,
  alt_text text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_images_sort_order_idx
  on public.gallery_images (sort_order, created_at);

create trigger gallery_images_updated_at
  before update on public.gallery_images
  for each row
  execute function public.set_updated_at();

alter table public.gallery_images enable row level security;

create policy "gallery_images_select_published"
  on public.gallery_images for select
  to anon, authenticated
  using (is_published = true or public.has_role_at_least('admin'));

create policy "gallery_images_insert_admin"
  on public.gallery_images for insert
  to authenticated
  with check (public.has_role_at_least('admin'));

create policy "gallery_images_update_admin"
  on public.gallery_images for update
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

create policy "gallery_images_delete_admin"
  on public.gallery_images for delete
  to authenticated
  using (public.has_role_at_least('admin'));

-- Storage policies
create policy "storage_gallery_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

create policy "storage_gallery_insert_admin"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'gallery'
    and public.has_role_at_least('admin')
  );

create policy "storage_gallery_update_admin"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'gallery'
    and public.has_role_at_least('admin')
  );

create policy "storage_gallery_delete_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'gallery'
    and public.has_role_at_least('admin')
  );
