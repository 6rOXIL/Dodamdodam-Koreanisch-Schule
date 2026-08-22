-- ---------------------------------------------------------------------------
-- 공개 신청/문의 폼 + 제출 내역
-- ---------------------------------------------------------------------------

create table public.site_forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ko text not null,
  title_en text not null default '',
  title_de text not null default '',
  description_ko text not null default '',
  description_en text not null default '',
  description_de text not null default '',
  success_message_ko text not null default '신청이 접수되었습니다. 감사합니다.',
  success_message_en text not null default 'Your application has been received. Thank you.',
  success_message_de text not null default 'Ihre Anmeldung ist eingegangen. Vielen Dank.',
  fields jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_forms_sort_order_idx on public.site_forms (sort_order);

create trigger site_forms_updated_at
  before update on public.site_forms
  for each row execute function public.set_updated_at();

create table public.site_form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.site_forms (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index site_form_submissions_form_created_idx
  on public.site_form_submissions (form_id, created_at desc);

alter table public.site_forms enable row level security;
alter table public.site_form_submissions enable row level security;

-- 공개: 게시된 폼 읽기
create policy "site_forms_select_published"
  on public.site_forms for select
  to anon, authenticated
  using (is_published = true or public.has_role_at_least('admin'));

create policy "site_forms_all_admin"
  on public.site_forms for all
  to authenticated
  using (public.has_role_at_least('admin'))
  with check (public.has_role_at_least('admin'));

-- 누구나 제출(게시된 폼만), 어드민만 조회/삭제
create policy "site_form_submissions_insert_public"
  on public.site_form_submissions for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.site_forms f
      where f.id = form_id and f.is_published = true
    )
  );

create policy "site_form_submissions_select_admin"
  on public.site_form_submissions for select
  to authenticated
  using (public.has_role_at_least('admin'));

create policy "site_form_submissions_delete_admin"
  on public.site_form_submissions for delete
  to authenticated
  using (public.has_role_at_least('admin'));

-- 시드: 입학/수강/대기 신청 폼
insert into public.site_forms (
  slug, title_ko, title_en, title_de,
  description_ko, description_en, description_de,
  sort_order, fields
) values (
  'enrollment',
  '입학/수강/대기 신청 상담 및 문의',
  'Enrollment / Course inquiry',
  'Anmeldung / Kursanfrage',
  '아래 양식을 작성해 주시면 담당 교사가 확인 후 연락드립니다.',
  'Please fill in the form below. A teacher will contact you.',
  'Bitte füllen Sie das Formular aus. Eine Lehrkraft meldet sich bei Ihnen.',
  1,
  '[
    {"id":"student_name","name":"student_name","type":"text","required":true,"label_ko":"학생 이름","label_en":"Student name","label_de":"Name des Schülers"},
    {"id":"gender","name":"gender","type":"radio","required":true,"label_ko":"성별","label_en":"Gender","label_de":"Geschlecht","options":[{"value":"male","label_ko":"남","label_en":"Male","label_de":"Männlich"},{"value":"female","label_ko":"여","label_en":"Female","label_de":"Weiblich"},{"value":"other","label_ko":"기타","label_en":"Other","label_de":"Divers"}]},
    {"id":"birthdate","name":"birthdate","type":"text","required":true,"label_ko":"생년월일 (YYYY.MM.DD 예: 2009.01.31)","label_en":"Date of birth (YYYY.MM.DD)","label_de":"Geburtsdatum (YYYY.MM.DD)","placeholder_ko":"2009.01.31","placeholder_en":"2009.01.31","placeholder_de":"2009.01.31"},
    {"id":"nationality","name":"nationality","type":"text","required":true,"label_ko":"국적","label_en":"Nationality","label_de":"Staatsangehörigkeit"},
    {"id":"address","name":"address","type":"text","required":true,"label_ko":"주소","label_en":"Address","label_de":"Adresse"},
    {"id":"postal_city","name":"postal_city","type":"text","required":true,"label_ko":"우편번호 / 도시","label_en":"Postal code / City","label_de":"PLZ / Stadt"},
    {"id":"email","name":"email","type":"email","required":true,"label_ko":"이메일","label_en":"Email","label_de":"E-Mail"},
    {"id":"phone","name":"phone","type":"tel","required":false,"label_ko":"휴대폰 번호 (*학생이 미성년자인 경우 학부모 연락처)","label_en":"Mobile phone (parent contact if minor)","label_de":"Handy (Elternkontakt bei Minderjährigen)"},
    {"id":"parent_name","name":"parent_name","type":"text","required":false,"label_ko":"학부모 성명 (*학생이 미성년자인 경우)","label_en":"Parent name (if student is a minor)","label_de":"Name der Eltern (bei Minderjährigen)"},
    {"id":"relationship","name":"relationship","type":"radio","required":false,"label_ko":"학생과의 관계","label_en":"Relationship to student","label_de":"Beziehung zum Schüler","options":[{"value":"father","label_ko":"부","label_en":"Father","label_de":"Vater"},{"value":"mother","label_ko":"모","label_en":"Mother","label_de":"Mutter"},{"value":"guardian","label_ko":"기타 보호자","label_en":"Other guardian","label_de":"Andere Erziehungsberechtigte"}]},
    {"id":"class_interest","name":"class_interest","type":"select","required":true,"label_ko":"어느 학급에 관심이 있습니까?","label_en":"Which class are you interested in?","label_de":"Für welche Klasse interessieren Sie sich?","options":[{"value":"kindergarten","label_ko":"유치반","label_en":"Kindergarten","label_de":"Kindergarten"},{"value":"elementary","label_ko":"초등반","label_en":"Elementary","label_de":"Grundschule"},{"value":"adults","label_ko":"성인반","label_en":"Adults","label_de":"Erwachsene"},{"value":"other","label_ko":"기타 / 상담","label_en":"Other / consultation","label_de":"Sonstiges / Beratung"}]},
    {"id":"message","name":"message","type":"textarea","required":false,"label_ko":"담당 교사/학교에 전달하실 말씀","label_en":"Message for the teacher / school","label_de":"Nachricht an die Lehrkraft / Schule"}
  ]'::jsonb
)
on conflict (slug) do nothing;

-- 사이트 메뉴에 신청 페이지 링크 (이미 있으면면 무시)
insert into public.site_nav_items
  (slug, href_path, label_ko, label_en, label_de, sort_order, content_kind, is_visible)
values
  ('enrollment', '/apply/', '입학·수강 신청', 'Apply', 'Anmeldung', 8, 'form:enrollment', true)
on conflict (slug) do nothing;
