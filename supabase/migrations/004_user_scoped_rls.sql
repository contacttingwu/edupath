-- ============================================================
-- EduPath — User-scoped RLS
-- Migration: 004_user_scoped_rls.sql
--
-- Each user (advisor) can only see and modify their own students.
-- Child tables (visas, applications, consultations, australian_education)
-- are scoped via the parent student's user_id.
-- ============================================================


-- ─── 1. Add user_id to students ─────────────────────────────
alter table students
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Auto-set user_id to the inserting user on every new student
create or replace function set_student_user_id()
returns trigger language plpgsql security definer as $$
begin
  new.user_id = auth.uid();
  return new;
end;
$$;

drop trigger if exists students_set_user_id on students;
create trigger students_set_user_id
  before insert on students
  for each row execute function set_student_user_id();


-- ─── 2. Drop old broad policies ─────────────────────────────

-- Students
drop policy if exists "Authenticated users can read students"   on students;
drop policy if exists "Authenticated users can insert students" on students;
drop policy if exists "Authenticated users can update students" on students;
drop policy if exists "Authenticated users can delete students" on students;

-- Visas
drop policy if exists "Authenticated users can read visas"   on visas;
drop policy if exists "Authenticated users can insert visas" on visas;
drop policy if exists "Authenticated users can update visas" on visas;
drop policy if exists "Authenticated users can delete visas" on visas;

-- Applications
drop policy if exists "Authenticated users can read applications"   on applications;
drop policy if exists "Authenticated users can insert applications" on applications;
drop policy if exists "Authenticated users can update applications" on applications;
drop policy if exists "Authenticated users can delete applications" on applications;

-- Consultations
drop policy if exists "Authenticated users can read consultations"   on consultations;
drop policy if exists "Authenticated users can insert consultations" on consultations;
drop policy if exists "Authenticated users can update consultations" on consultations;
drop policy if exists "Authenticated users can delete consultations" on consultations;


-- ─── 3. Create user-scoped policies ─────────────────────────

-- STUDENTS — direct user_id check
create policy "Users see own students"
  on students for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users insert own students"
  on students for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

create policy "Users update own students"
  on students for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users delete own students"
  on students for delete
  to authenticated
  using (user_id = auth.uid());


-- Helper: owned student ids for current user
-- (used inline in child table policies)

-- VISAS — scoped via student ownership
create policy "Users see own visas"
  on visas for select
  to authenticated
  using (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Users insert own visas"
  on visas for insert
  to authenticated
  with check (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Users update own visas"
  on visas for update
  to authenticated
  using (student_id in (select id from students where user_id = auth.uid()))
  with check (student_id in (select id from students where user_id = auth.uid()));

create policy "Users delete own visas"
  on visas for delete
  to authenticated
  using (
    student_id in (select id from students where user_id = auth.uid())
  );


-- APPLICATIONS — scoped via student ownership
create policy "Users see own applications"
  on applications for select
  to authenticated
  using (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Users insert own applications"
  on applications for insert
  to authenticated
  with check (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Users update own applications"
  on applications for update
  to authenticated
  using (student_id in (select id from students where user_id = auth.uid()))
  with check (student_id in (select id from students where user_id = auth.uid()));

create policy "Users delete own applications"
  on applications for delete
  to authenticated
  using (
    student_id in (select id from students where user_id = auth.uid())
  );


-- CONSULTATIONS — scoped via student ownership
create policy "Users see own consultations"
  on consultations for select
  to authenticated
  using (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Users insert own consultations"
  on consultations for insert
  to authenticated
  with check (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Users update own consultations"
  on consultations for update
  to authenticated
  using (student_id in (select id from students where user_id = auth.uid()))
  with check (student_id in (select id from students where user_id = auth.uid()));

create policy "Users delete own consultations"
  on consultations for delete
  to authenticated
  using (
    student_id in (select id from students where user_id = auth.uid())
  );


-- AUSTRALIAN EDUCATION — scoped via student ownership
-- (only create if table exists)
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'australian_education') then

    drop policy if exists "Authenticated users can read australian_education"   on australian_education;
    drop policy if exists "Authenticated users can insert australian_education" on australian_education;
    drop policy if exists "Authenticated users can update australian_education" on australian_education;
    drop policy if exists "Authenticated users can delete australian_education" on australian_education;

    execute $p$
      create policy "Users see own australian_education"
        on australian_education for select to authenticated
        using (student_id in (select id from students where user_id = auth.uid()))
    $p$;
    execute $p$
      create policy "Users insert own australian_education"
        on australian_education for insert to authenticated
        with check (student_id in (select id from students where user_id = auth.uid()))
    $p$;
    execute $p$
      create policy "Users update own australian_education"
        on australian_education for update to authenticated
        using (student_id in (select id from students where user_id = auth.uid()))
        with check (student_id in (select id from students where user_id = auth.uid()))
    $p$;
    execute $p$
      create policy "Users delete own australian_education"
        on australian_education for delete to authenticated
        using (student_id in (select id from students where user_id = auth.uid()))
    $p$;

  end if;
end;
$$;


-- ─── 4. Assign existing students to the oldest user ─────────
-- Run this ONCE to claim existing data for the first account.
-- Safe to run even if all students already have a user_id.
update students
set user_id = (select id from auth.users order by created_at asc limit 1)
where user_id is null;
