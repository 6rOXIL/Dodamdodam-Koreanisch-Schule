-- dodamdodam: 회원 역할 + 자료실
-- Supabase Dashboard → SQL Editor 에서 실행하거나 `supabase db push` 로 적용

-- ---------------------------------------------------------------------------
-- 역할 (일반 → 멤버 → 교사 → 어드민)
-- ---------------------------------------------------------------------------
create type public.user_role as enum (
  'general',
  'member',
  'teacher',
  'admin'
);

-- ---------------------------------------------------------------------------
-- 프로필 (auth.users 1:1)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  role public.user_role not null default 'general',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- 자료실
-- ---------------------------------------------------------------------------
create table public.resource_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ko text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.resource_categories (id) on delete set null,
  class_slug text,
  title text not null,
  description text,
  storage_path text not null,
  file_name text not null,
  file_size bigint,
  mime_type text,
  uploaded_by uuid not null references auth.users (id) on delete restrict,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index resources_category_idx on public.resources (category_id);
create index resources_class_slug_idx on public.resources (class_slug);
create index resources_published_idx on public.resources (is_published) where is_published = true;

-- ---------------------------------------------------------------------------
-- 헬퍼: 현재 사용자 역할
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.has_role_at_least(required public.user_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select case public.current_user_role()
        when 'admin' then 4
        when 'teacher' then 3
        when 'member' then 2
        when 'general' then 1
        else 0
      end
    ) >= case required
      when 'admin' then 4
      when 'teacher' then 3
      when 'member' then 2
      when 'general' then 1
    end,
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- 가입 시 프로필 자동 생성 (기본: 일반)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger resources_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 어드민: 회원 역할 변경
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_user_role(
  target_user_id uuid,
  new_role public.user_role
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.profiles;
  admin_count int;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.has_role_at_least('admin') then
    raise exception 'forbidden: admin only';
  end if;

  if target_user_id = auth.uid() and new_role <> 'admin' then
    select count(*) into admin_count from public.profiles where role = 'admin';
    if admin_count <= 1 then
      raise exception 'cannot demote the last admin';
    end if;
  end if;

  update public.profiles
  set role = new_role
  where id = target_user_id
  returning * into result;

  if result.id is null then
    raise exception 'user not found';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_set_user_role(uuid, public.user_role) from public;
grant execute on function public.admin_set_user_role(uuid, public.user_role) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.resource_categories enable row level security;
alter table public.resources enable row level security;

-- profiles: 본인 조회/수정(역할 제외), 어드민 전체
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.has_role_at_least('admin'));

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- categories: 멤버 이상 읽기, 어드민 CRUD
create policy "categories_select_member"
  on public.resource_categories for select
  to authenticated
  using (public.has_role_at_least('member'));

create policy "categories_all_admin"
  on public.resource_categories for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

-- resources: 멤버 이상 published 읽기 / 교사 이상 업로드·본인 수정 / 어드민 전체
create policy "resources_select_published_member"
  on public.resources for select
  to authenticated
  using (
    public.has_role_at_least('member')
    and (
      is_published = true
      or uploaded_by = auth.uid()
      or public.has_role_at_least('admin')
    )
  );

create policy "resources_insert_teacher"
  on public.resources for insert
  to authenticated
  with check (
    public.has_role_at_least('teacher')
    and uploaded_by = auth.uid()
  );

create policy "resources_update_own_teacher"
  on public.resources for update
  to authenticated
  using (
    uploaded_by = auth.uid()
    and public.has_role_at_least('teacher')
  )
  with check (uploaded_by = auth.uid());

create policy "resources_all_admin"
  on public.resources for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

-- ---------------------------------------------------------------------------
-- Storage: class-materials 버킷 (Dashboard에서 private 버킷 생성 후 정책 적용)
-- 버킷 이름: class-materials
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'class-materials',
  'class-materials',
  false,
  52428800,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/msword'
  ]
)
on conflict (id) do nothing;

create policy "storage_class_materials_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'class-materials'
    and public.has_role_at_least('member')
  );

create policy "storage_class_materials_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'class-materials'
    and public.has_role_at_least('teacher')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_class_materials_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'class-materials'
    and public.has_role_at_least('teacher')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_class_materials_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'class-materials'
    and (
      public.has_role_at_least('admin')
      or (
        public.has_role_at_least('teacher')
        and (storage.foldername(name))[1] = auth.uid()::text
      )
    )
  );

-- ---------------------------------------------------------------------------
-- 시드: 자료 카테고리 (선택)
-- ---------------------------------------------------------------------------
insert into public.resource_categories (slug, name_ko, sort_order) values
  ('handout', '수업 자료', 1),
  ('homework', '숙제', 2),
  ('notice', '안내', 3)
on conflict (slug) do nothing;
