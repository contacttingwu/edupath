-- ============================================================
-- EduPath — Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- ─── STUDENTS ───────────────────────────────────────────────
create table if not exists students (
  id                uuid primary key default gen_random_uuid(),

  -- Personal
  name              text not null,
  preferred_name    text,
  dob               date,
  nationality       text,

  -- Contact
  email             text,
  phone             text,
  addr_overseas     text,
  addr_home         text,

  -- Emergency contact
  ec_name           text,
  ec_relationship   text,
  ec_phone          text,
  ec_email          text,
  ec_addr           text,

  -- Background
  education_history text,
  work_experience   text,

  -- Pipeline status
  status            text not null default 'Consulting'
                    check (status in (
                      'Consulting',
                      'Documents Preparing',
                      'Applied',
                      'Awaiting Decision',
                      'Offer Received',
                      'Enrolled',
                      'Visa Lodged',
                      'Visa Approved',
                      'Departed'
                    )),

  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger students_updated_at
  before update on students
  for each row execute function update_updated_at();


-- ─── VISAS ──────────────────────────────────────────────────
create table if not exists visas (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references students(id) on delete cascade,
  visa_type    text,
  visa_number  text,
  issue_date   date,
  expiry_date  date,
  is_current   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Enforce only one current visa per student
create unique index visas_one_current_per_student
  on visas (student_id)
  where is_current = true;

create index visas_student_id_idx on visas (student_id);
create index visas_expiry_date_idx on visas (expiry_date) where is_current = true;


-- ─── APPLICATIONS ───────────────────────────────────────────
create table if not exists applications (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references students(id) on delete cascade,
  school       text,
  program      text,
  intake_date  date,
  status       text,
  created_at   timestamptz not null default now()
);

create index applications_student_id_idx on applications (student_id);


-- ─── CONSULTATIONS ──────────────────────────────────────────
create table if not exists consultations (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references students(id) on delete cascade,
  consult_date  date not null,
  notes         text not null,
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now()
);

create index consultations_student_id_idx on consultations (student_id);
create index consultations_date_idx on consultations (consult_date desc);
