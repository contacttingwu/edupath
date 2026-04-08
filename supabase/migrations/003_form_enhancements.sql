-- ============================================================
-- EduPath — Form Enhancements
-- Migration: 003_form_enhancements.sql
-- ============================================================

-- Google Drive link + second emergency contact on students
alter table students
  add column if not exists google_drive_link text,
  add column if not exists ec2_name          text,
  add column if not exists ec2_relationship  text,
  add column if not exists ec2_phone         text,
  add column if not exists ec2_email         text,
  add column if not exists ec2_addr          text;

-- Visa outcome + appeal tracking on visas
alter table visas
  add column if not exists outcome         text default 'pending'
    check (outcome in ('pending', 'granted', 'refused')),
  add column if not exists appeal_decision text
    check (appeal_decision in ('appeal', 'left', null)),
  add column if not exists appeal_status   text;
