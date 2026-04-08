-- ============================================================
-- EduPath — Demo Seed Data
-- 8 students across various pipeline stages
-- Run via: npx supabase db reset (includes seed automatically)
-- Or manually paste into Supabase SQL editor
-- ============================================================

-- Disable RLS for seeding (re-enabled by migrations)
set session_replication_role = replica;

-- ─── STUDENTS ───────────────────────────────────────────────
insert into students (id, name, preferred_name, dob, nationality, email, phone,
  addr_overseas, addr_home, ec_name, ec_relationship, ec_phone, ec_email,
  education_history, work_experience, status, notes) values

-- 1. Early stage
('11111111-0000-0000-0000-000000000001',
 'Chen Wei',            'Wei',
 '2001-03-15',         'Taiwanese',
 'chen.wei@email.com', '+886 912 345 678',
 null,
 '12 Zhongxiao E Rd, Taipei 106',
 'Chen Mei',           'Mother',    '+886 912 111 222', 'chen.mei@email.com',
 '3F Zhongxiao E Rd, Taipei 106',
 'National Taiwan University, B.Sc. Computer Science (2019–2023)',
 'Software intern at Garmin Taiwan (2022)',
 'Consulting',
 'Interested in Master of IT at UNSW or UTS. Budget conscious.'
),

-- 2. Documents stage
('11111111-0000-0000-0000-000000000002',
 'Park Soyeon',         'Sophie',
 '1999-07-22',         'South Korean',
 'soyeon.park@email.com', '+82 10 2345 6789',
 '201-dong 5-ho, Mapo-gu, Seoul',
 '201-dong 5-ho, Mapo-gu, Seoul',
 'Park Junho',         'Father',    '+82 10 9876 5432', 'park.junho@email.com',
 'Mapo-gu, Seoul 04001',
 'Yonsei University, B.A. English Literature (2018–2022)',
 'English tutor at YBM Institute (2022–2023)',
 'Documents Preparing',
 'Applying for Master of TESOL at University of Melbourne.'
),

-- 3. Applied
('11111111-0000-0000-0000-000000000003',
 'Nguyen Thi Lan',      'Lan',
 '2000-11-08',         'Vietnamese',
 'lan.nguyen@email.com', '+84 91 234 5678',
 '45 Tran Hung Dao, Hanoi',
 '45 Tran Hung Dao, Hoan Kiem, Hanoi 10000',
 'Nguyen Van Duc',     'Father',    '+84 91 111 2222', 'duc.nguyen@email.com',
 '45 Tran Hung Dao, Hanoi',
 'Hanoi University, B.Eng. Civil Engineering (2018–2022)',
 'Site engineer at Coteccons (2022–2024)',
 'Applied',
 'Applied to Master of Engineering at University of Queensland.'
),

-- 4. Awaiting Decision
('11111111-0000-0000-0000-000000000004',
 'Tanaka Hiroshi',      'Hiro',
 '1998-05-30',         'Japanese',
 'hiro.tanaka@email.com', '+81 90 3456 7890',
 '3-5-8 Shibuya, Tokyo',
 '3-5-8 Shibuya, Shibuya-ku, Tokyo 150-0002',
 'Tanaka Keiko',       'Mother',    '+81 90 1111 2222', 'keiko.tanaka@email.com',
 '3-5-8 Shibuya, Tokyo',
 'Waseda University, B.B.A. (2017–2021)',
 'Marketing coordinator at Dentsu (2021–2024)',
 'Awaiting Decision',
 'MBA applications submitted to RMIT and Monash. Awaiting outcome.'
),

-- 5. Offer Received
('11111111-0000-0000-0000-000000000005',
 'Liu Xiao',            'Xiao',
 '2001-09-14',         'Chinese',
 'xiao.liu@email.com', '+86 138 0013 8000',
 'Room 301, Block B, Chaoyang, Beijing',
 'Room 301, Block B, Shuangjing, Chaoyang, Beijing 100022',
 'Liu Feng',           'Father',    '+86 138 9999 0000', 'feng.liu@email.com',
 'Shuangjing, Chaoyang, Beijing',
 'Peking University, B.Sc. Physics (2020–2024)',
 null,
 'Offer Received',
 'Received offer from University of Sydney for Master of Physics. Considering acceptance.'
),

-- 6. Enrolled / Visa Lodged
('11111111-0000-0000-0000-000000000006',
 'Kim Jiyoung',         'Joy',
 '1997-02-19',         'South Korean',
 'joy.kim@email.com',  '+82 10 5678 9012',
 'Unit 12, 45 Swanston St, Melbourne VIC 3000',
 '102-ho, Gangnam-gu, Seoul 06000',
 'Kim Sangwoo',        'Brother',   '+82 10 3333 4444', 'sangwoo.kim@email.com',
 'Gangnam-gu, Seoul 06000',
 'Korea University, B.A. International Studies (2016–2020)',
 'Trade analyst at KOTRA (2020–2023)',
 'Visa Lodged',
 'Student visa application lodged. CoE confirmed for RMIT MBA.'
),

-- 7. Visa Approved
('11111111-0000-0000-0000-000000000007',
 'Patel Priya',         'Priya',
 '2000-06-25',         'Indian',
 'priya.patel@email.com', '+91 98765 43210',
 'Apt 5B, 22 Collins St, Melbourne VIC 3000',
 '14 Gandhi Nagar, Ahmedabad, Gujarat 380009',
 'Rajesh Patel',       'Father',    '+91 98700 11111', 'rajesh.patel@email.com',
 '14 Gandhi Nagar, Ahmedabad, Gujarat 380009',
 'Gujarat University, B.Com (2018–2021)',
 'Accounts assistant at Infosys BPO (2021–2023)',
 'Visa Approved',
 'Student visa granted. Orientation at Deakin on 25 Feb 2026.'
),

-- 8. Departed
('11111111-0000-0000-0000-000000000008',
 'Santos Maria',        'Maria',
 '1999-12-01',         'Brazilian',
 'maria.santos@email.com', '+55 11 91234 5678',
 '87 Bourke St, Melbourne VIC 3000',
 'Rua das Flores 45, São Paulo SP 01310-100',
 'Carlos Santos',      'Father',    '+55 11 98765 4321', 'carlos.santos@email.com',
 'Rua das Flores 45, São Paulo',
 'USP, B.A. Communications (2018–2022)',
 'Junior journalist at Folha de S.Paulo (2022–2023)',
 'Departed',
 'Currently studying Master of Media at RMIT. Arrived Feb 2024.'
);


-- ─── VISAS ──────────────────────────────────────────────────
insert into visas (student_id, visa_type, visa_number, issue_date, expiry_date, is_current) values

-- Chen Wei — no visa yet
-- Park Soyeon — no visa yet
-- Lan — no visa yet
-- Hiro — no visa yet

-- Liu Xiao — student visa incoming (offered, not lodged)
('11111111-0000-0000-0000-000000000005', 'Student Visa (Subclass 500)', null, null, null, true),

-- Joy Kim — visa lodged, showing current tourist visa expiring soon
('11111111-0000-0000-0000-000000000006', 'Tourist Visa (Subclass 600)', 'TV-2024-KR-88321', '2024-07-01', '2026-04-20', true),

-- Priya Patel — approved student visa
('11111111-0000-0000-0000-000000000007', 'Student Visa (Subclass 500)', 'SV-2025-IN-44512', '2025-11-15', '2027-12-15', true),

-- Maria Santos — active student visa, expires further out
('11111111-0000-0000-0000-000000000008', 'Student Visa (Subclass 500)', 'SV-2023-BR-10234', '2023-12-01', '2026-12-01', true);


-- ─── APPLICATIONS ───────────────────────────────────────────
insert into applications (student_id, school, program, intake_date, status) values

('11111111-0000-0000-0000-000000000001', 'UNSW Sydney',            'Master of Information Technology',  '2026-07-01', 'Considering'),
('11111111-0000-0000-0000-000000000001', 'University of Technology Sydney', 'Master of IT Management', '2026-07-01', 'Considering'),

('11111111-0000-0000-0000-000000000002', 'University of Melbourne','Master of TESOL',                   '2026-03-01', 'Documents Submitted'),

('11111111-0000-0000-0000-000000000003', 'University of Queensland','Master of Engineering Science',    '2026-02-01', 'Application Submitted'),

('11111111-0000-0000-0000-000000000004', 'RMIT University',        'MBA',                               '2026-03-01', 'Application Submitted'),
('11111111-0000-0000-0000-000000000004', 'Monash University',      'MBA',                               '2026-03-01', 'Application Submitted'),

('11111111-0000-0000-0000-000000000005', 'University of Sydney',   'Master of Physics',                 '2026-07-01', 'Offer Letter Received'),

('11111111-0000-0000-0000-000000000006', 'RMIT University',        'MBA',                               '2025-07-01', 'Enrolled'),

('11111111-0000-0000-0000-000000000007', 'Deakin University',      'Master of Commerce',                '2026-03-01', 'Enrolled'),

('11111111-0000-0000-0000-000000000008', 'RMIT University',        'Master of Media and Communication', '2024-02-01', 'Enrolled');


-- ─── CONSULTATIONS ──────────────────────────────────────────
insert into consultations (student_id, consult_date, notes, tags) values

('11111111-0000-0000-0000-000000000001', '2026-03-10',
 'Initial consultation. Wei is interested in IT programs at UNSW and UTS. Budget is approx AUD 90k total. Parents will fund. Discussed entry requirements and IELTS preparation.',
 ARRAY['Initial Consult', 'Program Selection']),

('11111111-0000-0000-0000-000000000002', '2026-02-20',
 'Document checklist provided. Sophie needs certified translations of her Yonsei transcripts. Bank statement must show minimum AUD 21,041 for living costs. Target submission: end of March.',
 ARRAY['Documents', 'Financial']),

('11111111-0000-0000-0000-000000000002', '2026-03-18',
 'Follow-up: translations received and look good. Waiting on updated bank statement from father. Reminded Sophie to book English test.',
 ARRAY['Documents', 'Follow-up']),

('11111111-0000-0000-0000-000000000003', '2026-01-15',
 'Application submitted to UQ. Lan has strong academic background and work experience. GTE statement reviewed and finalised. Estimated decision: 4-6 weeks.',
 ARRAY['Application', 'GTE']),

('11111111-0000-0000-0000-000000000004', '2026-02-05',
 'Both RMIT and Monash MBA applications submitted. Hiro has excellent GMAT score (710). Monash requires a personal interview — scheduled for 20 Feb.',
 ARRAY['Application', 'Interview']),

('11111111-0000-0000-0000-000000000004', '2026-02-22',
 'Monash interview completed. Hiro felt confident. RMIT still reviewing. Expected decisions by mid-March.',
 ARRAY['Interview', 'Follow-up']),

('11111111-0000-0000-0000-000000000005', '2026-03-25',
 'Offer letter received from USyd for Master of Physics. Reviewing conditions — must provide proof of Honours year result by 30 April. Xiao is very excited. Will accept.',
 ARRAY['Offer', 'Conditions']),

('11111111-0000-0000-0000-000000000006', '2026-03-01',
 'CoE issued by RMIT. Visa application (Subclass 500) lodged online. Health exam booked for 10 March. Joy currently on bridging visa in Melbourne.',
 ARRAY['Visa', 'CoE', 'Health Exam']),

('11111111-0000-0000-0000-000000000007', '2026-01-20',
 'Student visa approved! Grant number confirmed. Priya flying in 15 Feb. Orientation week starts 25 Feb at Deakin Burwood campus. Sent orientation info pack.',
 ARRAY['Visa Approved', 'Arrival']),

('11111111-0000-0000-0000-000000000008', '2026-03-30',
 'Semester 1 check-in. Maria settling in well in Melbourne. Passed all subjects last semester. Discussed extending visa before Dec 2026 expiry — still 8 months out, will revisit in August.',
 ARRAY['Check-in', 'Visa Renewal']);


-- Re-enable RLS
set session_replication_role = default;
