-- ============================================
-- INCUSAAF DEMO / SEED DATA
-- ============================================

-- STUDENTS
insert into public.students
(admission_number, first_name, last_name, email, class, graduation_year, status)
values
('INC-2026-001', 'Daniel', 'Okafor', 'daniel@example.com', 'SS3', 2026, 'Student'),
('INC-2026-002', 'Esther', 'Eze', 'esther@example.com', 'SS2', 2027, 'Student'),
('INC-2026-003', 'Michael', 'Obi', 'michael@example.com', 'SS1', 2028, 'Student'),
('INC-2026-004', 'Grace', 'Nwankwo', 'grace@example.com', 'SS3', 2026, 'Student'),
('INC-2026-005', 'Samuel', 'Ibe', 'samuel@example.com', 'SS2', 2027, 'Student')
on conflict (admission_number) do nothing;


-- ALUMNI
insert into public.alumni
(alumni_number, first_name, last_name, email, occupation, company, graduation_year)
values
('ALU2026001', 'Wesley', 'Alumni', 'alu2026001@alumniconnect.app', 'Student', 'INCUSAAF', 2026),
('ALU2026002', 'Chinedu', 'Okoro', 'chinedu@example.com', 'Software Engineer', 'Technology', 2024),
('ALU2026003', 'Ada', 'Nnamani', 'ada@example.com', 'Medical Student', 'University', 2023),
('ALU2026004', 'David', 'Eze', 'david@example.com', 'Entrepreneur', 'Private Business', 2022),
('ALU2026005', 'Joy', 'Okeke', 'joy@example.com', 'Accountant', 'Finance', 2021)
on conflict (alumni_number) do nothing;


-- EVENTS
insert into public.events
(title, description, venue, starts_at, ends_at)
values
(
    'INCUSAAF Alumni Reunion 2026',
    'Annual reunion for members of the INCUSAAF community.',
    'INCUSAAF Campus',
    '2026-12-20 10:00:00+01',
    '2026-12-20 16:00:00+01'
),
(
    'Career & Mentorship Day',
    'Alumni connect with current students for career guidance.',
    'School Assembly Hall',
    '2027-01-15 09:00:00+01',
    '2027-01-15 15:00:00+01'
),
(
    'Alumni Sports Day',
    'Community sports and networking event.',
    'School Sports Field',
    '2027-02-20 09:00:00+01',
    '2027-02-20 17:00:00+01'
);


-- JOB / OPPORTUNITIES
insert into public.jobs
(title, company, description, application_link)
values
(
    'Junior Software Internship',
    'Technology Company',
    'Entry-level opportunity for students interested in software development.',
    'https://example.com'
),
(
    'Business Administration Internship',
    'Private Business',
    'Internship opportunity for students interested in business administration.',
    'https://example.com'
),
(
    'Graphic Design Internship',
    'Creative Studio',
    'Creative internship opportunity for aspiring designers.',
    'https://example.com'
);


-- ANNOUNCEMENTS
insert into public.announcements
(title, body)
values
(
    'Welcome to AlumniConnect',
    'Welcome to the official INCUSAAF AlumniConnect platform.'
),
(
    'Alumni Registration',
    'Alumni members can now create and maintain their AlumniConnect profiles.'
),
(
    'Community Updates',
    'Stay connected with school events, opportunities and alumni activities.'
);
