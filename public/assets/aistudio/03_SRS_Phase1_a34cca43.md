---

title: "Software Requirements Specification"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# Software Requirements Specification

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

Phase 1 — Functional and non-functional requirements

| Document ID | PP-P1-SRS-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Introduction

### 1.1 Purpose

This SRS defines the externally observable behaviour and quality requirements of PathProof Phase 1. Developers, testers and the supervisor should use it to decide what is in scope and whether implementation is complete.

### 1.2 Scope

Phase 1 includes student/admin authentication, student academic and skill profile, interest/activity preferences, career catalogue, curated job evidence, career recommendations, career comparison, skill gap analysis, Career Reality Report and basic administration. Practical challenges, roadmap generation, portfolios, counsellor workflows and advanced learning analytics are Phase 2.

### 1.3 Terms and definitions

| Term | Meaning |
| --- | --- |
| Alignment score | An explainable indicator of how closely the student’s mapped subjects, interests and preferred work activities correspond to a career profile. |
| Skill coverage | Weighted proportion of the career’s required skill levels currently met or partially met by the student’s self-reported skills. |
| Job evidence | A dated observation of a public job/internship posting and its structured requirements. |
| Career mapping | An administrator-maintained relationship between a career and subjects, skills or preference tags. |
| RBAC | Role-based access control. |
| MVP | Minimum viable product; the smallest complete Phase 1 experience that satisfies its acceptance criteria. |

## 2. Overall description

### 2.1 Product perspective

PathProof is a browser-based client-server application. The React client calls a versioned Express REST API. The API validates requests, applies authorization, executes domain services and reads/writes data in MySQL.

### 2.2 User classes

| Role | Permissions |
| --- | --- |
| STUDENT | Manage own profile, subjects, skills, preferences; browse careers/evidence; generate and view own recommendations, comparisons and reports. |
| ADMIN | Manage users through restricted administrative operations; maintain career catalogue, subject/skill/tag mappings and job evidence; view data-quality information. |

COUNSELLOR is reserved for Phase 2. Phase 1 must not expose counsellor routes or grant counsellor permissions.

### 2.3 Operating environment

- Modern browser: current Chrome, Edge or Firefox.

- Frontend: React.js and Tailwind CSS.

- Backend: supported Node.js LTS release and Express.js.

- Database: MySQL 8.x recommended.

- Development tools: VS Code, Git, Postman and MySQL Workbench.

## 3. Functional requirements

| Requirement ID | Requirement statement |
| --- | --- |
| FR-AUTH-01 | The system shall allow a visitor to register as a STUDENT using name, email and password. |
| FR-AUTH-02 | The system shall reject duplicate email addresses after case normalization. |
| FR-AUTH-03 | The system shall store only a salted password hash, never a plain-text password. |
| FR-AUTH-04 | The system shall authenticate users and establish a secure session. |
| FR-AUTH-05 | The system shall allow an authenticated user to log out and invalidate the session. |
| FR-AUTH-06 | The system shall authorize each protected API operation by role and resource ownership. |
| FR-AUTH-07 | Public registration shall not allow the caller to choose ADMIN role. |
| FR-PROF-01 | The system shall allow a student to create and update one profile linked to their account. |
| FR-PROF-02 | The profile shall store university, degree programme, current semester and optional graduation year. |
| FR-PROF-03 | The profile shall store weekly learning hours, budget preference and learning preference. |
| FR-PROF-04 | The student shall add academic subjects and mark each as COMPLETED, IN_PROGRESS or PLANNED. |
| FR-PROF-05 | The system shall prevent duplicate subject records for the same student. |
| FR-SKILL-01 | The student shall browse active skills by category. |
| FR-SKILL-02 | The student shall add one record per skill and select proficiency level 1–4. |
| FR-SKILL-03 | The student shall update and remove their own skill records. |
| FR-SKILL-04 | Phase 1 skill records shall be identified as SELF_REPORTED. |
| FR-PREF-01 | The system shall display active interest and work-activity tags. |
| FR-PREF-02 | The student shall rate each selected preference from 1 to 5 and provide at least three ratings in each dimension before that dimension is used for matching. |
| FR-PREF-03 | The student shall update or remove preference ratings. |
| FR-CAR-01 | The system shall display published career profiles with category, summary and details. |
| FR-CAR-02 | The system shall support search by career title and filtering by category or mapped skill. |
| FR-CAR-03 | Career details shall show responsibilities, entry-level tasks, education notes, mapped subjects, required skills and job evidence. |
| FR-CAR-04 | The student shall compare up to three distinct careers in one comparison. |
| FR-EVID-01 | The system shall store job evidence with source URL, collection date, posting status and content-verification status. |
| FR-EVID-02 | The system shall link job evidence to zero or more normalized skills. |
| FR-EVID-03 | The system shall distinguish REQUIRED from PREFERRED skill mentions. |
| FR-EVID-04 | The system shall calculate skill occurrence counts using only selected eligible evidence records. |
| FR-EVID-05 | The user interface shall display the sample size and evidence date range near sample statistics. |
| FR-EVID-06 | The system shall not describe curated records as a live comprehensive vacancy feed. |
| FR-REC-01 | The system shall generate career alignment results for published careers when minimum profile inputs are available. |
| FR-REC-02 | The system shall calculate academic, interest and work-activity alignment dimensions separately. |
| FR-REC-03 | The system shall calculate skill readiness/coverage separately from career alignment. |
| FR-REC-04 | The system shall persist an assessment timestamp and algorithm version with generated results. |
| FR-REC-05 | The system shall display explanatory reasons and missing-data warnings. |
| FR-REC-06 | The system shall not label alignment or coverage as employment probability. |
| FR-GAP-01 | The system shall compare student skill proficiency against target proficiency for a selected career. |
| FR-GAP-02 | The system shall classify each requirement as MEETS_TARGET, DEVELOPING or MISSING. |
| FR-GAP-03 | The system shall calculate weighted skill coverage using career-skill importance weights. |
| FR-GAP-04 | The system shall display required level, student level and skill priority. |
| FR-REPORT-01 | The system shall generate a Career Reality Report for a selected student-career pair. |
| FR-REPORT-02 | The report shall include mapped academic subjects, preference alignment, skill coverage and sampled job evidence. |
| FR-REPORT-03 | The report shall show source links, collection/check dates and sample counts. |
| FR-ADMIN-01 | Only ADMIN users shall create, update, publish or archive career catalogue data. |
| FR-ADMIN-02 | Only ADMIN users shall manage skill, subject and preference-tag taxonomies. |
| FR-ADMIN-03 | Only ADMIN users shall create/update/archive job evidence and skill links. |
| FR-ADMIN-04 | The system shall record created_at and updated_at timestamps on maintainable records. |
| FR-ADMIN-05 | The system shall validate mapping weights and prevent invalid duplicate mappings. |

## 4. Business rules

| Rule ID | Business rule |
| --- | --- |
| BR-01 | A student account owns exactly zero or one student profile; the profile may be completed after registration. |
| BR-02 | Only STUDENT and ADMIN are active Phase 1 roles. |
| BR-03 | A proficiency level is an integer: 1 Beginner, 2 Basic, 3 Intermediate, 4 Advanced. |
| BR-04 | No student_skills row means the skill is not recorded; do not create a level-zero skill. |
| BR-05 | A career requirement has target_level 1–4 and importance_weight greater than zero. |
| BR-06 | Career skill importance weights for a career must be positive; normalize by their sum during calculations. |
| BR-07 | Job-evidence frequency is count(skill mentions) divided by eligible evidence-record count for that career; report numerator and denominator. |
| BR-08 | Only CONTENT_CHECKED evidence records with a valid career link contribute to default market-sample statistics; OPEN_AT_CHECK, CLOSED_OR_EXPIRED or NOT_STATED posting status is displayed separately. |
| BR-09 | Academic alignment gives completed subjects full credit and in-progress subjects partial credit; planned subjects do not count as acquired academic coverage. |
| BR-10 | If a score dimension lacks sufficient input, display NOT_ENOUGH_DATA and re-normalize only the available alignment dimensions; show which dimensions were omitted. |
| BR-11 | Career alignment and skill readiness are separate measures and must never be combined into a hiring probability. |
| BR-12 | A comparison contains 2 or 3 distinct career IDs. |
| BR-13 | All user-owned queries must constrain by authenticated user_id. |
| BR-14 | Student-submitted profile information is self-reported in Phase 1. |

## 5. Scoring and calculation requirements

### 5.1 Alignment score

Initial model: Alignment = 0.30 × Academic Score + 0.45 × Interest Score + 0.25 × Activity Score. Each component is normalized to 0–100. The weights are initial design assumptions and must be documented in the UI and reviewed during evaluation.

### 5.2 Academic score

For each subject mapped to the selected career, use the career_subjects importance weight. A completed subject receives multiplier 1.0; an in-progress subject receives 0.5; a planned or absent subject receives 0.0. Academic Score = weighted sum of subject multipliers / sum of mapped subject weights × 100. If no mapped subject data exists, mark the dimension NOT_ENOUGH_DATA.

### 5.3 Interest and activity scores

Each student preference is rated 1–5. Career mapping weights indicate the importance of each tag for the career. For a dimension, calculate the weighted average of (student rating / 5) × 100 for mapped tags with a student rating. Require at least three ratings in the INTEREST dimension and at least three ratings in the ACTIVITY dimension before the respective dimension is eligible. If fewer than three ratings or no mapped response data exists, mark that dimension NOT_ENOUGH_DATA. Do not silently treat unanswered questions as dislike.

### 5.4 Skill coverage / readiness

For CORE and IMPORTANT career skills, divide the student proficiency by the target proficiency and cap the ratio at 1.0. A missing student skill contributes 0. Skill Coverage = sum(weight × capped ratio) / sum(CORE and IMPORTANT skill weights) × 100. OPTIONAL skills are displayed as additional skills but excluded from the required coverage denominator. A skill meets target when student level ≥ target level; is developing when recorded level is below target; and is missing when no student skill record exists.

### 5.5 Recommendation output

Rank careers by available alignment score. Display skill coverage as a separate column. Where alignment dimensions are unavailable, expose the reduced dimension coverage so the student understands the lower-confidence comparison. Tie-break deterministically by higher academic score, then career title ascending.

## 6. External interface requirements

| Interface | Requirement |
| --- | --- |
| User interface | Responsive React pages with accessible forms, tables, charts and explanations. |
| API | JSON REST API under /api/v1; consistent success/error envelope; authenticated protected routes. |
| Database | MySQL relational schema with PK, FK, unique constraints, transactions and indexes. |
| External sources | Public job/internship source URLs are stored as evidence references; Phase 1 does not depend on live external APIs. |

## 7. Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-PERF-01 | Under the project’s documented demo/test dataset and local test environment, 95% of normal read requests should complete within 3 seconds, excluding external source navigation. |
| NFR-SEC-01 | Passwords shall be hashed with a current password-hashing library and safe parameters. |
| NFR-SEC-02 | All protected API routes shall enforce authentication, role and ownership checks. |
| NFR-SEC-03 | Use parameterized database queries or a safe ORM/query builder; do not concatenate untrusted input into SQL. |
| NFR-SEC-04 | Production deployment shall use HTTPS and secure, HttpOnly, SameSite cookies if cookie-based sessions are used. |
| NFR-SEC-05 | Validate file-free text inputs, query parameters and URLs; Phase 1 does not accept challenge evidence uploads. |
| NFR-PRIV-01 | Collect only profile information needed for Phase 1 and restrict private records to their owner and authorized administrator functions. |
| NFR-USAB-01 | Main student tasks shall provide clear labels, validation messages and recovery from errors. |
| NFR-ACC-01 | Use semantic headings, keyboard-operable controls, labelled inputs and sufficient contrast; status shall not rely on color alone. |
| NFR-REL-01 | Handle expected errors without losing saved user data; use transactions for multi-record operations. |
| NFR-MAINT-01 | Separate routes, controllers, services, validation and data access; use consistent naming and API documentation. |
| NFR-COMP-01 | Support current Chrome, Edge and Firefox desktop browsers and responsive mobile viewport layouts. |
| NFR-BACKUP-01 | Document a repeatable database backup and restore procedure before final demonstration. |

## 8. Use cases

| Use case | Specification |
| --- | --- |
| UC-01 Register | Actor: Visitor. Preconditions: email not registered. Main flow: open registration; enter name/email/password; validate; create STUDENT account; show success. Alternate: duplicate/invalid email or weak password displays field error. Postcondition: account exists. |
| UC-02 Complete profile | Actor: Student. Preconditions: authenticated. Main flow: open profile; enter degree and semester; select subjects/status; set learning constraints; save. Alternate: invalid semester/hours rejected. Postcondition: profile data saved. |
| UC-03 Manage skills | Actor: Student. Preconditions: authenticated. Main flow: browse skills; add skill and level; update/remove own skill. Alternate: duplicate skill blocked. Postcondition: profile skill list updated. |
| UC-04 Generate recommendations | Actor: Student. Preconditions: minimum profile inputs available. Main flow: request recommendations; system loads profile and mappings; calculates scores; stores assessment/results; returns ranked careers and explanations. Alternate: missing inputs prompt completion. Postcondition: versioned assessment saved. |
| UC-05 Compare careers | Actor: Student. Preconditions: two or three published careers selected. Main flow: submit career IDs; system loads data and user skill coverage; returns comparison matrix. Alternate: duplicate/unpublished/too many IDs rejected. Postcondition: comparison displayed; optional session saved. |
| UC-06 View skill gap | Actor: Student. Preconditions: selected published career. Main flow: load required skills; load own skills; calculate coverage; return per-skill status. Postcondition: gap report displayed. |
| UC-07 Maintain job evidence | Actor: Admin. Preconditions: admin authenticated. Main flow: add source details; validate URL and dates; link skills; save; display record. Alternate: invalid URL, duplicate or missing career rejected. Postcondition: evidence stored and auditable. |
| UC-08 Maintain career mapping | Actor: Admin. Preconditions: admin authenticated. Main flow: edit career; map skills/subjects/tags and weights; validate ranges; save. Postcondition: future scores use updated mapping version. |

## 9. Data validation requirements

| Field | Validation |
| --- | --- |
| Email | Valid email syntax; trim and lowercase for uniqueness; max 190 chars. |
| Password | Minimum length 10 recommended; reject common weak passwords if feasible; never log. |
| Semester | Integer 1–12 (configurable for local programmes). |
| Graduation year | Plausible four-digit year; optional. |
| Weekly learning hours | Numeric 0–80 inclusive; optional. |
| Budget preference | Enumerated value: FREE_ONLY, LOW_COST, FLEXIBLE, NOT_SPECIFIED. |
| Proficiency | Integer 1–4 only. |
| Preference score | Integer 1–5 only. |
| Skill target/weight | Target 1–4; positive importance weight. |
| Source URL | HTTP/HTTPS URL; reject javascript:, data: and other schemes. |
| Evidence dates | Collected date required; last-checked date cannot precede collection date. |
| Comparison career IDs | 2–3 distinct published career IDs. |

## 10. Error handling

Use stable machine-readable error codes and human-readable messages. Validation errors should identify the field. Never return SQL, stack traces, password hashes or internal secrets to the client. Log a correlation/request ID for server-side troubleshooting.

| HTTP status | Use |
| --- | --- |
| 400 | Malformed request or invalid parameter. |
| 401 | Missing or invalid authentication. |
| 403 | Authenticated but not permitted. |
| 404 | Resource not found or not visible to this user. |
| 409 | Duplicate or conflicting record. |
| 422 | Valid JSON but business-rule validation failed. |
| 429 | Rate limit exceeded. |
| 500 | Unexpected server error with generic client message. |

## 11. Traceability

The PRD modules map to requirement groups as follows: Authentication → FR-AUTH; profile/academics → FR-PROF; skills → FR-SKILL; interests → FR-PREF; career explorer/comparison → FR-CAR; job reality → FR-EVID; matching → FR-REC; gap analysis → FR-GAP; Career Reality Report → FR-REPORT; admin → FR-ADMIN. The test plan references each group.
