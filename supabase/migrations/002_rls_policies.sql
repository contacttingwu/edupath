-- ============================================================
-- EduPath — Row Level Security Policies
-- Migration: 002_rls_policies.sql
--
-- All tables are restricted to the authenticated user.
-- The single-advisor model means auth.uid() is the owner.
-- ============================================================

-- ─── STUDENTS ───────────────────────────────────────────────
alter table students enable row level security;

create policy "Authenticated users can read students"
  on students for select
  to authenticated
  using (true);

create policy "Authenticated users can insert students"
  on students for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update students"
  on students for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete students"
  on students for delete
  to authenticated
  using (true);


-- ─── VISAS ──────────────────────────────────────────────────
alter table visas enable row level security;

create policy "Authenticated users can read visas"
  on visas for select
  to authenticated
  using (true);

create policy "Authenticated users can insert visas"
  on visas for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update visas"
  on visas for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete visas"
  on visas for delete
  to authenticated
  using (true);


-- ─── APPLICATIONS ───────────────────────────────────────────
alter table applications enable row level security;

create policy "Authenticated users can read applications"
  on applications for select
  to authenticated
  using (true);

create policy "Authenticated users can insert applications"
  on applications for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update applications"
  on applications for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete applications"
  on applications for delete
  to authenticated
  using (true);


-- ─── CONSULTATIONS ──────────────────────────────────────────
alter table consultations enable row level security;

create policy "Authenticated users can read consultations"
  on consultations for select
  to authenticated
  using (true);

create policy "Authenticated users can insert consultations"
  on consultations for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update consultations"
  on consultations for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete consultations"
  on consultations for delete
  to authenticated
  using (true);
