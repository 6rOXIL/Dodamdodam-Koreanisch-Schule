-- 최초 어드민 1명 지정 (가입 후 1회만 실행)
-- 1) Supabase Auth에서 어드민 계정으로 회원가입
-- 2) 아래 UUID를 해당 사용자 id로 바꿔 실행

-- update public.profiles
-- set role = 'admin'
-- where id = '00000000-0000-0000-0000-000000000000';

-- 또는 이메일로:
-- update public.profiles p
-- set role = 'admin'
-- from auth.users u
-- where p.id = u.id and u.email = 'admin@example.com';
