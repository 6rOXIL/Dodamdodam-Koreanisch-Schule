-- 교사가 본인이 업로드한 자료를 삭제할 수 있도록 정책 추가
create policy "resources_delete_own_teacher"
  on public.resources for delete
  to authenticated
  using (
    uploaded_by = auth.uid()
    and public.has_role_at_least('teacher')
  );
