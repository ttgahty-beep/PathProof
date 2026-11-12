---

title: "Database Design & Data Dictionary"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# Database Design & Data Dictionary

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

Phase 1 — MySQL schema, relationships, constraints and seed data

| Document ID | PP-P1-DB-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Database overview

Database name: pathproof_db. Engine: MySQL 8.x with InnoDB. Character set: utf8mb4. The schema is relational and normalized around students, academic subjects, skills, career mappings, preference tags, job evidence and recommendation assessments.

## 2. Entity relationship diagrams

**Figure: Student and academic ERD**

![Student and academic ERD](diagrams/erd_student_phase1.png)

**Figure: Career and job-evidence ERD**

![Career and job-evidence ERD](diagrams/erd_career_phase1.png)

Figure 1. Student, academic, skill and preference entities.

Figure 2. Career, job evidence and recommendation entities. The detailed dictionary below is authoritative.

## 3. Naming and data rules

- Table names use lowercase snake_case and plural nouns.

- Primary keys use BIGINT UNSIGNED AUTO_INCREMENT unless a composite key is more appropriate.

- Foreign keys use the same type as the referenced primary key.

- Store timestamps in UTC; convert to local display time in the application.

- Use DECIMAL for scores and weights, not floating-point storage.

- Use ENUM or lookup constraints consistently for controlled status values.

- Use soft archive fields for reference data that may be referenced by old results; avoid hard deletion of mapped careers/skills.

## 4. Core table dictionary

### 4.1 users

Account identity and role.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| user_id | BIGINT UNSIGNED PK AI | Primary key. |
| full_name | VARCHAR(100) NOT NULL | Display name. |
| email | VARCHAR(190) NOT NULL UNIQUE | Trimmed/lowercase normalized email. |
| password_hash | VARCHAR(255) NOT NULL | Password hash only. |
| role | ENUM(STUDENT, ADMIN) NOT NULL | Never accepted from public registration payload. |
| account_status | ENUM(ACTIVE, DISABLED) NOT NULL | Admin-controlled. |
| created_at | DATETIME NOT NULL | UTC timestamp. |
| updated_at | DATETIME NOT NULL | UTC timestamp. |

Implementation notes: Create ADMIN account using a seed script or a controlled setup command; do not expose public admin registration.

### 4.2 student_profiles

One optional profile per student account.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| profile_id | BIGINT UNSIGNED PK AI | Primary key. |
| user_id | BIGINT UNSIGNED NOT NULL UNIQUE FK | References users.user_id. |
| university_name | VARCHAR(160) NULL | Student-entered institution. |
| degree_program | VARCHAR(120) NULL | e.g. BS Software Engineering. |
| current_semester | TINYINT UNSIGNED NULL | Validate 1–12. |
| graduation_year | SMALLINT UNSIGNED NULL | Optional. |
| weekly_learning_hours | DECIMAL(4,1) NULL | Validate 0–80. |
| budget_preference | ENUM(FREE_ONLY, LOW_COST, FLEXIBLE, NOT_SPECIFIED) | Default NOT_SPECIFIED. |
| learning_preference | ENUM(VIDEO, READING, PRACTICE, MIXED, NOT_SPECIFIED) | Default NOT_SPECIFIED. |
| created_at / updated_at | DATETIME NOT NULL | UTC timestamps. |

### 4.3 academic_subjects

Controlled list of academic subjects.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| subject_id | BIGINT UNSIGNED PK AI | Primary key. |
| subject_name | VARCHAR(140) NOT NULL | Unique subject name or controlled code. |
| subject_category | VARCHAR(80) NULL | e.g. Programming, Database, Mathematics. |
| description | TEXT NULL | Optional description. |
| is_active | BOOLEAN NOT NULL | Whether selectable. |
| created_at / updated_at | DATETIME NOT NULL | Timestamps. |

### 4.4 student_subjects

Subjects associated with a student.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| student_subject_id | BIGINT UNSIGNED PK AI | Primary key. |
| user_id | BIGINT UNSIGNED NOT NULL FK | References users.user_id. |
| subject_id | BIGINT UNSIGNED NOT NULL FK | References academic_subjects.subject_id. |
| study_status | ENUM(COMPLETED, IN_PROGRESS, PLANNED) | Required. |
| grade_text | VARCHAR(20) NULL | Optional; no grading-scale assumptions. |
| semester_taken | TINYINT UNSIGNED NULL | Optional. |
| created_at / updated_at | DATETIME NOT NULL | Timestamps. |

Implementation notes: Add UNIQUE(user_id, subject_id). Student ownership is enforced in the service layer.

### 4.5 skills

Controlled skill taxonomy.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| skill_id | BIGINT UNSIGNED PK AI | Primary key. |
| skill_name | VARCHAR(120) NOT NULL UNIQUE | Canonical name. |
| skill_category | VARCHAR(80) NOT NULL | e.g. Programming, Testing, Data, Design. |
| description | TEXT NULL | Definition. |
| is_active | BOOLEAN NOT NULL | Selectable status. |
| created_at / updated_at | DATETIME NOT NULL | Timestamps. |

### 4.6 student_skills

Self-reported student skill and proficiency.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| student_skill_id | BIGINT UNSIGNED PK AI | Primary key. |
| user_id | BIGINT UNSIGNED NOT NULL FK | References users.user_id. |
| skill_id | BIGINT UNSIGNED NOT NULL FK | References skills.skill_id. |
| proficiency_level | TINYINT UNSIGNED NOT NULL | 1 Beginner, 2 Basic, 3 Intermediate, 4 Advanced. |
| evidence_status | ENUM(SELF_REPORTED) NOT NULL | Phase 1 only. |
| notes | VARCHAR(500) NULL | Optional context. |
| created_at / updated_at | DATETIME NOT NULL | Timestamps. |

Implementation notes: Add CHECK(proficiency_level BETWEEN 1 AND 4) and UNIQUE(user_id, skill_id). Phase 2 can extend evidence records separately.

### 4.7 career_categories

Career grouping.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| category_id | BIGINT UNSIGNED PK AI | Primary key. |
| category_name | VARCHAR(100) NOT NULL UNIQUE | Category label. |
| description | TEXT NULL | Optional. |
| is_active | BOOLEAN NOT NULL | Publication selection. |
| created_at / updated_at | DATETIME NOT NULL | Timestamps. |

### 4.8 careers

Career catalogue.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| career_id | BIGINT UNSIGNED PK AI | Primary key. |
| category_id | BIGINT UNSIGNED NOT NULL FK | References career_categories.category_id. |
| career_title | VARCHAR(140) NOT NULL UNIQUE | Canonical role title. |
| summary | VARCHAR(500) NOT NULL | Short card text. |
| description | TEXT NOT NULL | Career explanation. |
| responsibilities | TEXT NULL | Typical work. |
| entry_level_tasks | TEXT NULL | Representative junior tasks. |
| education_notes | TEXT NULL | General education context. |
| publication_status | ENUM(DRAFT, PUBLISHED, ARCHIVED) | Controls visibility. |
| last_reviewed_at | DATETIME NULL | Content review date. |
| created_at / updated_at | DATETIME NOT NULL | Timestamps. |

### 4.9 career_skills

Required skills and target proficiency per career.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| career_id | BIGINT UNSIGNED PK part FK | References careers.career_id. |
| skill_id | BIGINT UNSIGNED PK part FK | References skills.skill_id. |
| target_level | TINYINT UNSIGNED NOT NULL | 1–4. |
| importance_weight | DECIMAL(6,2) NOT NULL | Positive; relative weight. |
| requirement_type | ENUM(CORE, IMPORTANT, OPTIONAL) | CORE and IMPORTANT are included in required skill coverage; OPTIONAL is excluded. |
| mapping_note | VARCHAR(500) NULL | Why the mapping exists. |

Implementation notes: Composite PK(career_id, skill_id); positive weight; target level 1–4. Skill coverage denominator includes CORE and IMPORTANT only; OPTIONAL skills remain visible as supplementary requirements.

### 4.10 career_subjects

Academic subjects mapped to a career.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| career_id | BIGINT UNSIGNED PK part FK | References careers.career_id. |
| subject_id | BIGINT UNSIGNED PK part FK | References academic_subjects.subject_id. |
| importance_weight | DECIMAL(6,2) NOT NULL | Positive relative weight. |
| mapping_note | VARCHAR(500) NULL | How the subject relates to the career. |

Implementation notes: Composite PK(career_id, subject_id). Weights normalize within a career.

### 4.11 interest_tags

Controlled interest and work-activity preference tags.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| interest_tag_id | BIGINT UNSIGNED PK AI | Primary key. |
| tag_code | VARCHAR(80) NOT NULL UNIQUE | Stable code. |
| tag_label | VARCHAR(120) NOT NULL | User-visible label. |
| tag_type | ENUM(INTEREST, ACTIVITY) NOT NULL | Separates dimensions. |
| description | VARCHAR(500) NULL | Help text. |
| is_active | BOOLEAN NOT NULL | Selectable status. |

### 4.12 student_preferences

Student preference ratings.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| user_id | BIGINT UNSIGNED PK part FK | References users.user_id. |
| interest_tag_id | BIGINT UNSIGNED PK part FK | References interest_tags.interest_tag_id. |
| preference_score | TINYINT UNSIGNED NOT NULL | 1–5. |
| updated_at | DATETIME NOT NULL | Timestamp. |

Implementation notes: Composite PK(user_id, interest_tag_id); check score 1–5. This table stores both INTEREST and ACTIVITY tags, distinguished by interest_tags.tag_type.

### 4.13 career_interest_tags

Career mapping to interest/activity tags.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| career_id | BIGINT UNSIGNED PK part FK | References careers.career_id. |
| interest_tag_id | BIGINT UNSIGNED PK part FK | References interest_tags.interest_tag_id. |
| importance_weight | DECIMAL(6,2) NOT NULL | Positive relative weight. |
| mapping_note | VARCHAR(500) NULL | Rationale. |

Implementation notes: Composite PK(career_id, interest_tag_id); normalize weights independently for INTEREST and ACTIVITY tag types.

### 4.14 job_evidence

Curated public job/internship posting observation.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| evidence_id | BIGINT UNSIGNED PK AI | Primary key. |
| career_id | BIGINT UNSIGNED NOT NULL FK | References careers.career_id. |
| job_title | VARCHAR(180) NOT NULL | Posting title. |
| organization_name | VARCHAR(180) NULL | Company/organization, if shown. |
| location_text | VARCHAR(160) NULL | Location as listed. |
| work_mode | ENUM(ONSITE, HYBRID, REMOTE, NOT_SPECIFIED) | Posting work arrangement. |
| source_name | VARCHAR(140) NOT NULL | Job board/company site name. |
| source_url | VARCHAR(1000) NOT NULL | Original public URL. |
| posted_date | DATE NULL | If stated. |
| collected_at | DATETIME NOT NULL | When team recorded it. |
| last_checked_at | DATETIME NULL | When source was last checked. |
| posting_status | ENUM(OPEN_AT_CHECK, CLOSED_OR_EXPIRED, NOT_STATED) | Posting status observed at last check; not a guarantee it is still open. |
| verification_status | ENUM(CONTENT_CHECKED, ACCESSIBLE_UNCONFIRMED, UNVERIFIABLE, ARCHIVED) | Only CONTENT_CHECKED records are eligible for skill-frequency statistics. |
| experience_level | VARCHAR(80) NULL | e.g. Internship, Entry Level. |
| education_text | TEXT NULL | Relevant stated requirement. |
| notes | TEXT NULL | Curator note. |

Implementation notes: Index(career_id, verification_status, collected_at). Eligible statistics include CONTENT_CHECKED records only; posting_status is displayed separately. Validate http/https URL and record when checked.

### 4.15 job_evidence_skills

Skill mentions found in each evidence record.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| evidence_id | BIGINT UNSIGNED PK part FK | References job_evidence.evidence_id. |
| skill_id | BIGINT UNSIGNED PK part FK | References skills.skill_id. |
| mention_type | ENUM(REQUIRED, PREFERRED) NOT NULL | How the skill is stated. |
| evidence_quote_note | VARCHAR(500) NULL | Short internal note; avoid copying large portions of source text. |

Implementation notes: Composite PK(evidence_id, skill_id). Count each skill once per evidence record for frequency statistics.

### 4.16 career_assessments

A dated recommendation calculation event.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| assessment_id | BIGINT UNSIGNED PK AI | Primary key. |
| user_id | BIGINT UNSIGNED NOT NULL FK | References users.user_id. |
| algorithm_version | VARCHAR(30) NOT NULL | e.g. p1.0. |
| profile_completeness | DECIMAL(5,2) NOT NULL | 0–100. |
| created_at | DATETIME NOT NULL | Calculation timestamp. |

Implementation notes: Store input snapshot or preserve versioned mappings if historical reproducibility is required. Avoid storing unnecessary sensitive content in snapshots.

### 4.17 career_recommendations

One result row per career per assessment.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| recommendation_id | BIGINT UNSIGNED PK AI | Primary key. |
| assessment_id | BIGINT UNSIGNED NOT NULL FK | References career_assessments.assessment_id. |
| career_id | BIGINT UNSIGNED NOT NULL FK | References careers.career_id. |
| academic_score | DECIMAL(5,2) NULL | 0–100 or NULL when unavailable. |
| interest_score | DECIMAL(5,2) NULL | 0–100 or NULL when unavailable. |
| activity_score | DECIMAL(5,2) NULL | 0–100 or NULL when unavailable. |
| alignment_score | DECIMAL(5,2) NULL | Re-normalized available dimensions; NULL if none available. |
| skill_coverage_score | DECIMAL(5,2) NULL | 0–100. |
| available_dimensions | TINYINT UNSIGNED NOT NULL | Count of alignment dimensions included. |
| rank_position | SMALLINT UNSIGNED NULL | Deterministic rank. |
| explanation_json | JSON NULL | Structured, factual explanation points. |

Implementation notes: Unique(assessment_id, career_id); index(assessment_id, rank_position).

### 4.18 career_comparison_sessions

Optional saved career comparison history.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| comparison_id | BIGINT UNSIGNED PK AI | Primary key. |
| user_id | BIGINT UNSIGNED NOT NULL FK | Owner. |
| created_at | DATETIME NOT NULL | Timestamp. |

Implementation notes: Use only if comparison history is included. It can be omitted from the MVP if comparison is stateless.

### 4.19 career_comparison_items

Careers inside a saved comparison.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| comparison_id | BIGINT UNSIGNED PK part FK | References career_comparison_sessions.comparison_id. |
| career_id | BIGINT UNSIGNED PK part FK | References careers.career_id. |
| display_order | TINYINT UNSIGNED NOT NULL | 1–3. |

Implementation notes: Composite PK(comparison_id, career_id); unique(comparison_id, display_order). Enforce 2–3 items in service logic.

### 4.20 admin_audit_logs

Audit sensitive administrator changes.

| Column | Suggested MySQL type | Rules / description |
| --- | --- | --- |
| audit_id | BIGINT UNSIGNED PK AI | Primary key. |
| admin_user_id | BIGINT UNSIGNED NOT NULL FK | Actor. |
| action | VARCHAR(80) NOT NULL | CREATE/UPDATE/ARCHIVE/ROLE_CHANGE etc. |
| entity_type | VARCHAR(80) NOT NULL | Affected entity/table. |
| entity_id | VARCHAR(80) NULL | Affected identifier. |
| summary | VARCHAR(500) NULL | Non-sensitive change summary. |
| created_at | DATETIME NOT NULL | Timestamp. |

Implementation notes: Do not store password values, session IDs or unnecessary personal data in audit summaries.

## 5. Relationships and cardinalities

| Relationship | Cardinality / rule |
| --- | --- |
| users → student_profiles | 1 to 0..1 |
| users → student_subjects | 1 to many |
| academic_subjects → student_subjects | 1 to many |
| users → student_skills | 1 to many |
| skills → student_skills | 1 to many |
| career_categories → careers | 1 to many |
| careers ↔ skills | many-to-many through career_skills |
| careers ↔ academic_subjects | many-to-many through career_subjects |
| careers ↔ interest_tags | many-to-many through career_interest_tags |
| users ↔ interest_tags | many-to-many through student_preferences |
| careers → job_evidence | 1 to many |
| job_evidence ↔ skills | many-to-many through job_evidence_skills |
| users → career_assessments | 1 to many |
| career_assessments → career_recommendations | 1 to many |
| careers → career_recommendations | 1 to many |
| users → career_comparison_sessions | 1 to many; optional history |
| career_comparison_sessions ↔ careers | many-to-many through career_comparison_items |

## 6. Index and constraint recommendations

- UNIQUE users(email).

- UNIQUE student_profiles(user_id).

- UNIQUE student_subjects(user_id, subject_id).

- UNIQUE student_skills(user_id, skill_id).

- UNIQUE career_skills(career_id, skill_id).

- UNIQUE career_subjects(career_id, subject_id).

- UNIQUE student_preferences(user_id, interest_tag_id).

- UNIQUE career_interest_tags(career_id, interest_tag_id).

- UNIQUE career_recommendations(assessment_id, career_id).

- Indexes on careers(publication_status, category_id), job_evidence(career_id, verification_status, collected_at), student_subjects(user_id), student_skills(user_id), and assessment ownership/date.

- Use ON DELETE RESTRICT for reference data with dependent records; use deliberate cascade only for dependent user data after an approved account deletion process.

## 7. Initial seed data

Before UI testing, seed the six career categories/profiles, initial skill taxonomy, academic subjects, interest/activity tags and career mappings. Populate a small job-evidence sample manually and store source/collection/verification metadata. Suggested initial target: 20–30 total postings across the six careers, but disclose the actual count and distribution in the demonstration.

| Seed group | Suggested starting content |
| --- | --- |
| Career categories | Software Development, Quality Assurance, Data & Analytics, Design & UX, Cybersecurity. |
| Career profiles | Frontend Developer, Backend Developer, QA Engineer, Data Analyst, UI/UX Designer, Cybersecurity Analyst. |
| Skills | Programming fundamentals, JavaScript, Java, Python, SQL, Git, REST APIs, HTML/CSS, manual testing, test case design, API testing, Selenium, data analysis, visualization, wireframing, usability, networking, security fundamentals. |
| Academic subjects | Programming Fundamentals, OOP, Data Structures, Database Systems, Software Engineering, Computer Networks, Operating Systems, Statistics, Human-Computer Interaction. |
| Interest/activity tags | Problem solving, building interfaces, analytical thinking, investigating defects, data patterns, visual design, security, documentation, independent work, teamwork. |

## 8. Backup and migration policy

- Keep schema changes in versioned SQL migration files.

- Seed reference data through repeatable scripts with stable unique codes.

- Back up the database before destructive migrations.

- Test restore on a separate local database before final presentation.

- Never commit production credentials or raw student data to Git.

## 9. Phase 2 compatibility

Keep stable IDs and avoid destructive redesign. Phase 2 may add challenge, submission, review, learning-resource, roadmap, task, portfolio, counsellor and evidence-verification tables. It should reference existing career_id, skill_id and user_id values.

## Editable diagram sources

- [erd_career_phase1.dot](diagrams/erd_career_phase1.dot)

- [erd_student_phase1.dot](diagrams/erd_student_phase1.dot)
