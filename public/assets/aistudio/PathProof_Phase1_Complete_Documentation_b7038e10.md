# PATHPROOF — COMPLETE PHASE 1 DOCUMENTATION
> Career Discovery & Intelligence  |  Version 1.0  |  Software Construction & Development semester project
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

## Contents
1. [01 Project Charter and Phase1 Scope](#01-project-charter-and-phase1-scope)
2. [02 PRD Phase1](#02-prd-phase1)
3. [03 SRS Phase1](#03-srs-phase1)
4. [04 Software Architecture Phase1](#04-software-architecture-phase1)
5. [05 Database Design and Data Dictionary](#05-database-design-and-data-dictionary)
6. [06 REST API Specification Phase1](#06-rest-api-specification-phase1)
7. [07 UML and Workflow Design Phase1](#07-uml-and-workflow-design-phase1)
8. [08 Test Plan and Acceptance Catalogue Phase1](#08-test-plan-and-acceptance-catalogue-phase1)
9. [09 Phase1 Development and Setup Guide](#09-phase1-development-and-setup-guide)

---

---

# Project Charter & Phase 1 Scope

Project foundation, boundaries, stakeholders and success conditions

| Document ID | PP-P1-CH-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## Document purpose

This charter formally defines the Phase 1 project problem, target users, objectives, boundaries, assumptions, constraints, stakeholders and approval gates. It is the starting reference for the PRD, SRS and technical design documents.

## 1. Project identity

| Item | Definition |
| --- | --- |
| Product | PathProof — Career Decision & Real-World Readiness Platform |
| Phase 1 name | Career Discovery & Intelligence |
| Academic context | Software Construction & Development (SCD) semester project |
| Initial audience | University students in Pakistan, initially computing-related degree programmes |
| Initial geography | Rawalpindi and Islamabad as the first research focus; data model remains Pakistan-wide |
| Proposed stack | React.js, Tailwind CSS, Node.js, Express.js, MySQL |
| Delivery model | One web application delivered incrementally in two project phases |

## 2. Problem and opportunity

Students can reach mid-degree semesters without a clear, evidence-based understanding of career options, entry-level employer expectations, or the relationship between their university subjects and professional work. Career information alone does not show an individual student what they currently know, which requirements they meet, and which requirements remain unmet.

PathProof Phase 1 will create a structured view of the student, academic subjects, skills, interests, career profiles and curated job/internship evidence. It will generate explainable career-alignment results, separate skill-readiness measures and a Career Reality Report.

## 3. Project vision

Help students move from vague career assumptions to informed career exploration by showing the relationship between their education, interests, current skills and sourced entry-level employment requirements.

## 4. Phase 1 objectives

- Let students create a profile containing degree, semester, subjects, skills, interests, work-activity preferences and learning constraints.

- Provide a searchable catalogue of at least six initial computing-related career paths.

- Maintain a curated and traceable sample of public job and internship requirements relevant to the initial careers.

- Calculate explainable career-alignment indicators and separate skill-readiness/coverage measures.

- Allow comparison of up to three career paths.

- Generate a report connecting completed or in-progress academic subjects, student skills and sampled employer requirements.

- Provide administrator tools for maintaining career, skill, subject and evidence data.

## 5. Stakeholders and responsibilities

| Stakeholder | Interest / responsibility |
| --- | --- |
| Student user | Creates profile, records skills/preferences, explores careers and reviews reports. |
| Administrator | Maintains platform users, career catalogue, skills, subject mappings and job evidence. |
| Project team | Researches, designs, implements, tests, documents and demonstrates Phase 1. |
| Project supervisor | Reviews scope, requirements, design quality, progress and academic deliverables. |
| Survey/interview participants | Provide research feedback; their responses must be recorded ethically and accurately. |

## 6. Phase 1 scope

| Included capability | Phase 1 outcome |
| --- | --- |
| Authentication and roles | Student registration/login and administrator access control. |
| Smart student profile | Academic, semester, subject, time, budget and learning preference data. |
| Skill inventory | Student skills with self-reported proficiency levels. |
| Interest/work-activity assessment | Structured preferences used in transparent matching. |
| Career Explorer | Six initial career profiles, categories, search and details. |
| Pakistan Job Reality Engine | Manually curated, source-tracked entry-level job/internship evidence. |
| Career Matching Engine | Explainable ranking using academic, interest and activity alignment. |
| Career Comparison | Side-by-side comparison of up to three career paths. |
| Skill Gap Analyzer | Weighted required-skill comparison and missing/developing skills. |
| Career Reality Report | Combined academic-to-industry, market-sample and skill-gap view. |
| Basic Admin Panel | CRUD and data-quality maintenance for Phase 1 data. |

## 7. Explicit exclusions from Phase 1

- Practical career simulations/challenges and submission evaluation.

- Learning-resource recommendation and adaptive roadmaps.

- Progress analytics based on completed development activities.

- Student portfolio and verified practical evidence.

- Counsellor assignment, feedback and counsellor dashboard.

- Live job-board integrations, automatic scraping, job applications or vacancy guarantees.

- AI chatbot, machine-learning predictions, CV generation, payments or employer recruitment tools.

| Phase boundary  Phase 1 may collect time and budget preferences to explain constraints, but it does not generate the adaptive learning roadmap. The roadmap and constraint-aware task scheduling belong to Phase 2. |
| --- |

## 8. Initial career catalogue

| Career ID (suggested) | Career | Initial category |
| --- | --- | --- |
| CAR-001 | Frontend Developer | Software Development |
| CAR-002 | Backend Developer | Software Development |
| CAR-003 | QA Engineer | Quality Assurance |
| CAR-004 | Data Analyst | Data & Analytics |
| CAR-005 | UI/UX Designer | Design & User Experience |
| CAR-006 | Cybersecurity Analyst | Cybersecurity |

The six roles are an initial project dataset, not an exhaustive representation of Pakistan’s labour market. A supervisor-approved change log should record any additions or removals.

## 9. Assumptions

- Students provide accurate self-reported profile and skill information.

- A small manually curated job-evidence sample is sufficient to demonstrate the data model and analysis workflow, but not to make national labour-market claims.

- Career and skill mappings are prepared and reviewed by the project team and, where available, a subject-matter reviewer.

- The first release is a responsive web application for modern desktop and mobile browsers.

- The project team has access to a development computer, database environment and version-control repository.

## 10. Constraints

- Semester deadline and available team capacity.

- Limited access to verified local job/internship data.

- No assumption of paid APIs or paid AI services.

- User-entered skills are not independently verified in Phase 1.

- The recommendation model is a transparent rule-based aid, not a validated psychometric assessment or hiring predictor.

## 11. Success and exit criteria

| Area | Phase 1 exit criterion |
| --- | --- |
| Functional completeness | All critical Phase 1 workflows pass acceptance tests. |
| Dataset | Six career profiles; target 20–30 curated job/internship evidence records, with source and collection dates. |
| Traceability | Every career requirement and job-evidence record can be traced to a source or clearly labelled team-defined mapping. |
| Recommendations | Scores are reproducible, explainable and separated from skill readiness. |
| Security | Role checks, password hashing, validation and safe error handling are tested. |
| Demonstration | A student can complete the end-to-end journey from profile setup to Career Reality Report. |

## 12. Approval checklist

- Supervisor approves the problem statement and intended users.

- Supervisor approves Phase 1 scope and confirms Phase 2 exclusions.

- Supervisor reviews the scoring approach and its limitations.

- Team confirms technology stack, repository owner and work allocation.

- Team confirms survey/interview plan and job-evidence collection method.

| Academic honesty  All survey findings, job evidence counts, screenshots, test results and implementation claims in the final report must reflect work actually completed. Do not fabricate participants, vacancies, sources or system results. |
| --- |

---

# Product Requirements Document

Phase 1 — Career Discovery & Intelligence

| Document ID | PP-P1-PRD-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Product summary

PathProof Phase 1 is a web application that helps university students explore realistic career alternatives using their academic background, stated interests, work-activity preferences, self-reported skills and a curated sample of entry-level job/internship requirements. The product provides explainable career-alignment results, independent skill-readiness measures, career comparison and a Career Reality Report.

## 2. Product principles

- Evidence before claims: display the source, collection date and sample size behind job-market observations.

- Separate alignment from readiness: interest/academic fit must not be confused with how many required skills a student currently meets.

- Explain recommendations: show component scores and reasons, not an unexplained “AI score”.

- Respect uncertainty: missing profile information is “not enough data”, not a zero score.

- Student agency: recommendations are decision support, not instructions or guarantees.

- Privacy by default: students see their own private profile and reports; administrators use privileged access only for defined maintenance tasks.

## 3. Target users and personas

### 3.1 Primary persona — computing student

A student in semester 2–8 of BS Computer Science, BS Software Engineering or BS Information Technology who is uncertain about career options, has some coursework and self-taught skills, and wants to understand how these relate to entry-level work.

### 3.2 Secondary persona — administrator

A trusted project administrator who curates the career catalogue, skill taxonomy, academic mappings and sampled job evidence, and who manages user accounts and data quality.

## 4. Jobs to be done

| When the student… | They need to… | PathProof provides… |
| --- | --- | --- |
| Is unsure which role to investigate | Explore options that relate to their education and interests | Career Explorer and explainable ranking |
| Has completed university subjects | Understand how coursework relates to professional roles | Semester-aware subject-to-career mapping |
| Sees a job posting | Understand recurring skills in the collected sample | Job Reality Engine with counts and citations/URLs |
| Considers two careers | Compare responsibilities, requirements and their own skill coverage | Career Comparison |
| Wants to know what is missing | See matched, developing and missing skills | Skill Gap Analyzer |
| Needs one understandable summary | Review academic fit, interest alignment, job evidence and skill gaps together | Career Reality Report |

## 5. Product outcomes

| Outcome | Measurement approach |
| --- | --- |
| Students can complete an initial profile | Profile completion funnel and usability test |
| Students can discover career options | Career detail views and search success in usability tests |
| Students understand recommendation reasons | Task-based comprehension questions after viewing results |
| Students can distinguish readiness from alignment | Usability check: ask participants to explain the two measures |
| Evidence is traceable | Audit a sample of job records and career mappings |
| Main journey works reliably | Functional acceptance test pass rate |

## 6. Phase 1 module requirements

| Module | Product requirement |
| --- | --- |
| P1-M01 Authentication & roles | Student registration, login, logout, password hashing, session management, role-based route protection. Public registration creates STUDENT accounts only; ADMIN accounts are provisioned securely. |
| P1-M02 Smart Student Profile | Personal/university details, degree, semester, graduation year, completed/in-progress/planned subjects, weekly learning hours, budget preference and preferred learning method. |
| P1-M03 Skill Inventory | Browse active skills; add/update/remove self-reported skills; proficiency Beginner/Basic/Intermediate/Advanced; category and optional notes. |
| P1-M04 Interest and activity assessment | Students rate interest and preferred work-activity tags on a 1–5 scale. Tags are maintained by admin and mapped to careers. |
| P1-M05 Career Explorer | Search/filter by title/category/skill; career detail pages with responsibilities, entry-level tasks, education notes, skills and related evidence. |
| P1-M06 Pakistan Job Reality Engine | Admin-curated job/internship evidence with company/title, location, work mode, source URL, collection/verification dates, experience level and linked skills. Display sample-limited frequency statistics. |
| P1-M07 Career Matching Engine | Calculate academic, interest and activity alignment dimensions; rank careers; explain contributing factors; save assessment and result version. |
| P1-M08 Career Comparison | Compare up to three careers using responsibilities, mapped subjects, required skills, sampled evidence, and the student’s own skill coverage. |
| P1-M09 Skill Gap Analyzer | Weighted skill coverage with meets-target/developing/missing statuses, required proficiency and priority. |
| P1-M10 Career Reality Report | Combine student academic profile, subject mappings, career alignment, skill coverage and sampled job evidence into a clear report. |
| P1-M11 Basic Admin Panel | Manage users (limited safe actions), careers, categories, skills, academic subjects/mappings, interest tags, job evidence and linked evidence skills. |

## 7. Core user stories

| ID | User story |
| --- | --- |
| US-01 | As a student, I want to register and log in so my profile and results are private. |
| US-02 | As a student, I want to record my degree and semester so career guidance reflects my academic stage. |
| US-03 | As a student, I want to record completed and ongoing subjects so the system can map coursework to careers. |
| US-04 | As a student, I want to list my skills and levels so the system can calculate skill coverage. |
| US-05 | As a student, I want to rate interests and work activities so recommendations reflect my preferences. |
| US-06 | As a student, I want to browse career profiles so I understand typical work and entry-level activities. |
| US-07 | As a student, I want to see job evidence and source dates so I can judge how current and representative it is. |
| US-08 | As a student, I want to generate career recommendations with explanations so I can investigate options. |
| US-09 | As a student, I want to compare up to three careers so I can examine trade-offs. |
| US-10 | As a student, I want a skill gap report so I know which required skills I meet or still need to develop. |
| US-11 | As a student, I want one Career Reality Report so academic subjects, interests, skills and job evidence are shown together. |
| US-12 | As an administrator, I want to maintain career and skill mappings so results use controlled data. |
| US-13 | As an administrator, I want to maintain dated job evidence so the market sample remains traceable. |

## 8. Career catalogue content model

Each career profile must contain: title; category; short summary; full description; typical responsibilities; representative entry-level tasks; education notes; related academic subjects; required skills with target level, importance weight and requirement type; interest/activity tags; related job-evidence records; last content review date; and publication status.

## 9. Career Reality Engine content model

A job_evidence record is a research observation, not a live vacancy guarantee. It stores the original source URL, source name, job title, organization, location, work mode, experience level, optional posting date, collection date, last checked date, posting_status and verification_status. Each linked skill is marked REQUIRED or PREFERRED. A CONTENT_CHECKED record may still describe a posting that has since closed; it remains useful for historical requirement sampling if the source content was inspected. ACCESSIBLE_UNCONFIRMED and UNVERIFIABLE records are excluded from skill-frequency statistics.

| Sample interpretation  A statement such as “SQL appeared in 4 of 5 sampled Data Analyst postings” describes only the five records in the project sample. It must not be presented as “80% of Pakistani employers require SQL”. |
| --- |

## 10. Recommendation experience

The student selects “Generate recommendations”. The system validates profile completeness, calculates scores for eligible careers, displays a ranked shortlist and shows component scores, matched profile details and missing profile inputs. Students can open any career, compare it with another option and view a skill gap report.

| Measure | Definition | Not a measure of |
| --- | --- | --- |
| Career alignment | Academic subject, interest and work-activity preference alignment based on defined mappings. | Probability of career success or job placement. |
| Skill readiness / coverage | Weighted coverage of skills and proficiency levels defined for a career. | Proof of practical skill unless separately demonstrated; Phase 1 is self-reported. |
| Job evidence frequency | Count/proportion of linked skill mentions in the collected sample. | National or complete market demand. |

## 11. UX and content requirements

- Use plain language and define technical terms.

- Display progress through profile setup but allow users to save and return.

- Use accessible labels, keyboard navigation and adequate color contrast.

- Never use color as the only status signal.

- Show “not enough profile data” when a score dimension cannot be calculated.

- Provide a “How this result was calculated” explanation beside recommendation and coverage scores.

- Show source links and dates near job-evidence statistics.

- Use responsive layouts for desktop and mobile browsers.

## 12. Phase 1 acceptance criteria

| ID | Acceptance criterion |
| --- | --- |
| AC-01 | A student can register, log in and log out. |
| AC-02 | A student can save degree, semester, subjects, time and budget preferences. |
| AC-03 | A student can add, edit and remove skills with levels. |
| AC-04 | A student can rate interest and activity tags. |
| AC-05 | At least six career profiles are searchable and have required profile fields. |
| AC-06 | Job evidence records display source URL, collection date and verification status. |
| AC-07 | Skill frequency is based on visible sample counts and is labelled as sample-limited. |
| AC-08 | Recommendations show alignment components and do not call the score a hiring probability. |
| AC-09 | Skill coverage is calculated separately from career alignment. |
| AC-10 | A student can compare no more than three careers in one comparison. |
| AC-11 | Career Reality Report displays academic mappings, interests, job evidence and skill gaps. |
| AC-12 | Admin-only data management endpoints reject student accounts. |
| AC-13 | All critical test cases pass before demonstration. |

## 13. Product analytics (Phase 1)

- Registration completion and profile completion counts.

- Career catalogue views and search terms, using privacy-conscious aggregate reporting.

- Recommendation generation count and result openings.

- Career comparison usage.

- Skill gap report generation count.

- Admin evidence records created, updated and reviewed.

Do not collect unnecessary sensitive personal data or expose individual student activity to other students. Analytics should support product evaluation, not surveillance.

## 14. Dependencies and open decisions

- Supervisor approval of initial target audience and six-role career catalogue.

- Agreed method for collecting and checking public job/internship evidence.

- Review of the scoring formula and mappings by a faculty member or knowledgeable reviewer where possible.

- Decision on email verification and password-reset email provider; if no provider is available, document the development/demo limitation.

- Decision on deployment target and file/database backup responsibility.

---

# Software Requirements Specification

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

---

# Software Architecture & Design

Phase 1 — Logical architecture, components, security and deployment

| Document ID | PP-P1-ARCH-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Architecture goals

- Keep frontend, backend business logic and persistence concerns separate.

- Make each Phase 1 module independently understandable and testable.

- Allow Phase 2 modules to be added without replacing the Phase 1 foundation.

- Use explainable deterministic recommendation logic with versioned mappings.

- Protect student-owned data and administrator-only maintenance operations.

- Keep infrastructure lightweight enough for a semester project.

## 2. Architectural style

Use a three-tier client-server architecture with a modular monolith backend. A modular monolith is recommended over microservices because the project has a small team, one primary database and a semester timeline. Modules are separated by code boundaries, not deployed as independent services.

Figure 1. Logical three-tier architecture and Phase 1 services.

## 3. Layer responsibilities

| Layer | Technology | Responsibilities | Must not do |
| --- | --- | --- | --- |
| Presentation | React.js, Tailwind CSS, Chart.js | Routes/pages, forms, client state, display validation, API calls, charts and accessibility. | Direct database access or trusted score calculation. |
| Application | Node.js, Express.js | Authentication, RBAC, request validation, use-case orchestration, scoring, comparison and report generation. | Render page markup or expose database credentials. |
| Data | MySQL | Store normalized accounts, profiles, mappings, evidence and assessment results; enforce constraints. | Contain business rules that exist only in the UI. |

## 4. Backend module boundaries

| Backend module | Main responsibilities | Primary data |
| --- | --- | --- |
| auth | Register, login, logout, session verification, role middleware. | users, session store |
| student-profile | Profile and academic subject CRUD; ownership checks. | student_profiles, academic_subjects, student_subjects |
| skills | Skill catalogue and student skill CRUD. | skills, student_skills |
| preferences | Interest/activity taxonomy and student ratings. | interest_tags, student_preferences |
| careers | Career search, details, category and comparison data. | career_categories, careers, mappings |
| job-evidence | Evidence CRUD, linked skills and sample statistics. | job_evidence, job_evidence_skills |
| recommendations | Input completeness, score calculation, ranking and explanation. | career_assessments, career_recommendations |
| skill-gap | Per-career skill coverage and status calculation. | career_skills, student_skills |
| reports | Aggregate career, academic, skill and evidence views. | all relevant read models |
| admin | Privileged catalogue and data maintenance. | catalogue/evidence tables, admin audit log |

## 5. Request lifecycle

- Browser sends HTTPS request to /api/v1.

- Express request middleware assigns request ID, parses body, applies CORS/security headers and checks session where required.

- Route validates path, query and body using module validators.

- Authentication middleware resolves user; authorization checks role and resource ownership.

- Controller calls a service; services enforce business rules and orchestrate repository/data-access operations.

- Database transaction is used when multiple related rows must succeed or fail together.

- API returns a standard JSON envelope; frontend renders loading, success, empty and error states.

## 6. Recommendation engine design

### 6.1 Inputs

- Student degree/semester and student_subjects status.

- Student preference ratings separated by INTEREST and ACTIVITY tag types.

- Student self-reported skills and proficiency.

- Published career subject, tag and skill mappings.

### 6.2 Calculation

Alignment score uses three independent dimensions: Academic 30%, Interest 45%, Work-activity preference 25%. Each dimension is normalized to 0–100. The INTEREST and ACTIVITY dimensions require at least three ratings each; below that threshold the dimension is NOT_ENOUGH_DATA. If a dimension has no usable responses/mappings, it is marked NOT_ENOUGH_DATA and the remaining available dimension weights are normalized to sum to 100%. Display which dimensions were included.

Academic score uses completed subjects at 1.0 and in-progress subjects at 0.5; planned subjects are 0. Interest and activity scores use student ratings divided by 5 and weighted by career mapping importance. Skill coverage is a separate weighted calculation: min(student proficiency / career target level, 1) × skill weight, divided by total required-skill weight.

### 6.3 Explanation generation

Explanations should be generated from deterministic facts: “Your completed Database Systems subject maps to this role”; “You rated analytical problem-solving highly”; “SQL is below the target level”; “The skill was found in 3 of 4 eligible postings in the project sample.” Do not generate unsupported narrative claims.

### 6.4 Versioning

Store algorithm_version on each assessment. When weights, tag mappings or career mappings change, increment the relevant data/algorithm version or preserve a mapping snapshot so old results can be interpreted. At minimum, save the algorithm version and computed timestamp.

## 7. API and security architecture

- Base path: /api/v1.

- Use JSON request/response bodies and a consistent response envelope.

- Use server-side sessions with secure, HttpOnly, SameSite cookies; use HTTPS in deployment.

- Use CSRF protection for cookie-authenticated state-changing requests.

- Hash passwords using bcrypt or Argon2 through a maintained library.

- Use parameterized SQL or safe ORM queries.

- Apply login and registration rate limits.

- Never allow public role selection or client-side-only authorization.

- Use ownership checks on every student-owned record.

- Keep secrets in environment variables; commit only .env.example.

## 8. Data architecture and transactions

Use MySQL InnoDB with foreign keys. Use unique constraints for email, one profile per user, one student-skill row per user/skill, one subject status per user/subject and composite mapping uniqueness. Use transactions for creating a career assessment plus its recommendation rows, and for editing a career’s mappings.

## 9. Frontend architecture

| Area | Suggested structure |
| --- | --- |
| Routing | Public routes, student protected routes and admin protected routes. |
| Feature pages | auth, dashboard, profile, skills, careers, comparison, recommendations, skill-gap, reports, admin. |
| Shared components | AppShell, Sidebar, Header, FormField, DataTable, ScoreCard, EvidenceSource, StatusBadge, LoadingState, EmptyState. |
| API layer | One configured API client with cookie credentials, response handling and request error normalization. |
| State | Local component state for forms; lightweight context for current user/session and shared profile refresh. |
| Forms | Client validation for usability plus identical server-side validation for security. |
| Charts | Use charts only to clarify data; always provide labels/legend and text equivalent. |

## 10. Deployment architecture

**Figure: Logical architecture diagram**

![Logical architecture diagram](diagrams/architecture_phase1.png)

Figure 2. Logical architecture reused for local development and deployment.

Development deployment may run React dev server, Express API and MySQL locally. Production/deployment should serve the built React application and API over HTTPS, restrict database network access, use environment-managed credentials, and enable database backups. Do not expose MySQL directly to the public internet.

## 11. Phase 2 extensibility

Reserve future extension points but do not implement Phase 2 functionality in Phase 1: challenge service, evaluation service, learning resource service, roadmap service, portfolio service, counsellor service and notification service. Phase 1 career IDs and skill IDs must remain stable so Phase 2 challenges/resources can reference them.

## 12. Architecture decisions

**Figure: Domain class overview**

![Domain class overview](diagrams/class_overview_phase1.png)

| ADR | Decision | Reason / consequence |
| --- | --- | --- |
| ADR-01 | Use a modular monolith, not microservices. | Lower operational overhead; enforce module boundaries in code. |
| ADR-02 | Use rule-based scoring before AI/ML. | Explainable, testable and feasible with curated project data. |
| ADR-03 | Separate alignment from readiness. | Prevents interest fit from being mistaken for skill capability. |
| ADR-04 | Manually curate job evidence for Phase 1. | Avoids fragile scraping/API dependency; requires source/date governance. |
| ADR-05 | Use one MySQL database across both phases. | Keeps Phase 2 compatible with stable Phase 1 career/skill IDs. |
| ADR-06 | Use admin-provisioned administrator accounts. | Prevents privilege escalation through public registration. |

## Editable diagram sources

- [architecture_phase1.dot](diagrams/architecture_phase1.dot)

- [class_overview_phase1.dot](diagrams/class_overview_phase1.dot)

---

# Database Design & Data Dictionary

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

---

# REST API Specification

Phase 1 — Routes, permissions, payloads and response contracts

| Document ID | PP-P1-API-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. API conventions

| Item | Convention |
| --- | --- |
| Base path | /api/v1 |
| Protocol | HTTPS in deployment; HTTP only for local development. |
| Data format | application/json; UTF-8. |
| Authentication | Server-side session cookie; HttpOnly, Secure in production, SameSite; CSRF protection for state-changing cookie-authenticated requests. |
| Versioning | Breaking changes require a new API version. |
| Dates | ISO 8601 strings; server stores UTC. |
| Pagination | page (1-based) and pageSize (default 20, maximum 100). |
| Sorting | Allowlisted sort keys only; never interpolate raw sort strings into SQL. |

## 2. Response envelope

### 2.1 Success

```json
{
  "success": true,
  "data": { "id": 42 },
  "meta": { "requestId": "req-example" }
}
```

### 2.2 Validation error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": { "currentSemester": "Must be between 1 and 12." }
  },
  "meta": { "requestId": "req-example" }
}
```

## 3. Authentication endpoints

| Method & path | Access | Purpose |
| --- | --- | --- |
| POST /auth/register | Public | Create STUDENT account only. |
| POST /auth/login | Public | Authenticate and create session. |
| POST /auth/logout | Authenticated | Invalidate session. |
| GET /auth/me | Authenticated | Return current account and role. |
| GET /auth/csrf | Public/session bootstrap | Return CSRF token if cookie session strategy requires it. |

### 3.1 Register request

```json
{
  "fullName": "Student Name",
  "email": "student@example.com",
  "password": "A-long-demo-password-123"
}
```

Response: 201 Created with user_id, full_name, email and role. Never return password_hash. The role is assigned by the server as STUDENT.

### 3.2 Login request

```json
{"email":"student@example.com","password":"A-long-demo-password-123"}
```

Response: 200 OK; session cookie set by server. Return safe user summary only.

## 4. Student profile and academics

| Method & path | Access | Purpose |
| --- | --- | --- |
| GET /students/me/profile | Student | Get own profile. |
| PUT /students/me/profile | Student | Create/update own profile. |
| GET /academic-subjects | Authenticated | List active subjects. |
| GET /students/me/subjects | Student | List own subject records. |
| POST /students/me/subjects | Student | Add subject/status. |
| PUT /students/me/subjects/:id | Student owner | Update own subject record. |
| DELETE /students/me/subjects/:id | Student owner | Remove own subject record. |

### 4.1 Profile request

```json
{
  "universityName": "Example University",
  "degreeProgram": "BS Software Engineering",
  "currentSemester": 4,
  "graduationYear": 2028,
  "weeklyLearningHours": 5,
  "budgetPreference": "LOW_COST",
  "learningPreference": "PRACTICE"
}
```

## 5. Skills and preferences

| Method & path | Access | Purpose |
| --- | --- | --- |
| GET /skills | Authenticated | Browse active skill catalogue. |
| GET /students/me/skills | Student | List own skills. |
| POST /students/me/skills | Student | Add skill and proficiency. |
| PUT /students/me/skills/:id | Student owner | Update own skill. |
| DELETE /students/me/skills/:id | Student owner | Remove own skill. |
| GET /interest-tags | Authenticated | List tags grouped by INTEREST/ACTIVITY. |
| GET /students/me/preferences | Student | Get own ratings. |
| PUT /students/me/preferences | Student | Replace/upsert preference ratings. |

```text
POST /students/me/skills
{
  "skillId": 12,
  "proficiencyLevel": 3,
  "notes": "Used in university coursework"
}

PUT /students/me/preferences
{
  "preferences": [
    { "interestTagId": 2, "preferenceScore": 5 },
    { "interestTagId": 7, "preferenceScore": 4 }
  ]
}
```

## 6. Career catalogue and evidence

| Method & path | Access | Purpose |
| --- | --- | --- |
| GET /careers | Authenticated | Search/filter published careers. |
| GET /careers/:careerId | Authenticated | Career detail. |
| GET /careers/:careerId/evidence | Authenticated | Evidence records and sample metadata. |
| GET /careers/:careerId/market-summary | Authenticated | Sample skill frequency for the selected career. |
| GET /careers/:careerId/skill-requirements | Authenticated | Required target skills and weights. |
| GET /careers/:careerId/subject-mappings | Authenticated | Academic subject mappings. |

Query example: GET /careers?query=developer&categoryId=1&page=1&pageSize=20. Only published careers and eligible evidence are shown to students.

## 7. Recommendation, comparison, gap and report APIs

| Method & path | Access | Purpose |
| --- | --- | --- |
| POST /career-recommendations | Student | Generate and persist new assessment results. |
| GET /career-recommendations/latest | Student | Get latest own results. |
| GET /career-recommendations/:assessmentId | Student owner | Get specific assessment. |
| POST /career-comparisons | Student | Compare two or three published career IDs. |
| GET /careers/:careerId/skill-gap | Student | Calculate current student gap for one career. |
| GET /careers/:careerId/reality-report | Student | Get combined report for selected career. |

### 7.1 Generate recommendations response example

```json
{
  "success": true,
  "data": {
    "assessmentId": 91,
    "algorithmVersion": "p1.0",
    "results": [
      {
        "careerId": 3,
        "careerTitle": "QA Engineer",
        "alignmentScore": 78.4,
        "components": {
          "academic": 70.0,
          "interest": 85.0,
          "activity": 72.0,
          "includedDimensions": ["academic", "interest", "activity"]
        },
        "skillCoverage": 46.5,
        "reasons": [
          "Your Database Systems subject maps to this career.",
          "You rated investigation and problem-solving highly.",
          "SQL is below the target level for this career."
        ]
      }
    ]
  }
}
```

All values above are illustrative. The backend must calculate them from stored mappings and student data; the frontend must not manufacture or modify scores.

## 8. Admin endpoints

| Method & path | Role | Purpose |
| --- | --- | --- |
| GET /admin/users | ADMIN | List users with pagination and safe fields. |
| PATCH /admin/users/:id/status | ADMIN | Disable/enable a user; prevent disabling the active admin unintentionally. |
| POST /admin/career-categories | ADMIN | Create category. |
| POST /admin/careers | ADMIN | Create career. |
| PUT /admin/careers/:id | ADMIN | Update career. |
| POST /admin/skills | ADMIN | Create skill. |
| POST /admin/academic-subjects | ADMIN | Create subject. |
| PUT /admin/careers/:id/mappings | ADMIN | Replace career skill, subject and tag mappings transactionally. |
| POST /admin/job-evidence | ADMIN | Create evidence record and linked skills. |
| PUT /admin/job-evidence/:id | ADMIN | Update evidence and status. |
| POST /admin/interest-tags | ADMIN | Create preference tag. |
| GET /admin/data-quality | ADMIN | Review missing mapping/source/date warnings. |

## 9. API validation and authorization matrix

| Resource / operation | Anonymous | Student | Admin |
| --- | --- | --- | --- |
| Register student | Allowed | N/A | Allowed only through controlled admin action if needed |
| Read published career catalogue | No | Yes | Yes |
| Read own profile/skills/preferences | No | Own only | Not by default; privileged support access must be explicit and audited |
| Update another student profile | No | No | No by default |
| Create/update career mappings | No | No | Yes |
| Create/update job evidence | No | No | Yes |
| Generate own recommendation | No | Yes | Not a normal admin function |
| Read another student recommendation | No | No | No by default |

## 10. Standard error codes

| Code | HTTP | Meaning |
| --- | --- | --- |
| VALIDATION_ERROR | 400 or 422 | Input does not satisfy schema/business rules. |
| UNAUTHENTICATED | 401 | No valid session. |
| FORBIDDEN | 403 | Role/ownership check failed. |
| NOT_FOUND | 404 | Resource missing or not visible. |
| DUPLICATE_RESOURCE | 409 | Unique key conflict. |
| PROFILE_INCOMPLETE | 422 | Minimum recommendation inputs missing. |
| CAREER_NOT_PUBLISHED | 404 | Career is not available to student. |
| RATE_LIMITED | 429 | Request rate threshold reached. |
| INTERNAL_ERROR | 500 | Unexpected server error; details logged privately. |

## 11. Implementation notes

- Validate every request on the server even if the frontend also validates.

- Use transactions for multi-table updates and recommendation persistence.

- Apply pagination to admin/user/evidence lists.

- Avoid returning internal notes or administrator-only fields in student API responses.

- Escape or safely render user-provided text to prevent cross-site scripting.

- Use allowlisted filter and sort parameters.

- Add request IDs and structured logs without secrets or passwords.

---

# UML & System Workflow Design

Phase 1 — Use cases, domain classes, ERDs and interaction flows

| Document ID | PP-P1-UML-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Purpose

This document provides the core diagrams needed before implementation. The diagrams are high-level design views; the database data dictionary and SRS define the authoritative fields and rules.

## 2. Use case diagram

**Figure: Use case diagram**

![Use case diagram](diagrams/use_case_phase1.png)

Figure 1. Student and Administrator interactions with Phase 1.

### 2.1 Actor summaries

| Actor | Primary use cases |
| --- | --- |
| Student | Register/login; complete profile; manage subjects, skills and preferences; explore careers; view job evidence; generate recommendations; compare careers; view skill gaps and Career Reality Report. |
| Administrator | Manage accounts/status; maintain categories, careers, skills, subjects and preference tags; curate job evidence and mappings; inspect data quality. |

## 3. Domain class diagram

**Figure: Domain class overview**

![Domain class overview](diagrams/class_overview_phase1.png)

Figure 2. Simplified domain-class view. Junction entities represent many-to-many mappings.

### 3.1 Core class responsibilities

| Class / entity | Responsibility | Representative operations |
| --- | --- | --- |
| User | Account identity and role. | register, authenticate, deactivate |
| StudentProfile | Academic stage and learning constraints. | updateProfile, validateSemester |
| StudentSubject | Student-to-subject relation and status. | setStudyStatus |
| StudentSkill | Self-reported skill and proficiency. | setProficiency |
| Career | Career catalogue content. | publish, archive |
| CareerSkill | Required skill, target level and weight. | validateRequirement |
| JobEvidence | Dated source observation. | validateSource, updateVerification |
| CareerAssessment | One recommendation calculation event. | createAssessment |
| CareerRecommendation | One career result with component scores. | explain, rank |

## 4. Student ERD

**Figure: Student and academic ERD**

![Student and academic ERD](diagrams/erd_student_phase1.png)

Figure 3. Student profile, academic subjects, skills and preferences.

## 5. Career and evidence ERD

**Figure: Career and job-evidence ERD**

![Career and job-evidence ERD](diagrams/erd_career_phase1.png)

Figure 4. Careers, skill/subject/tag mappings, job evidence and recommendations.

The full logical schema includes the additional tables defined in the Database Design and Data Dictionary document: student_profiles, academic_subjects, student_subjects, skills, student_skills, career_categories, careers, career_skills, career_subjects, interest_tags, student_preferences, career_interest_tags, job_evidence, job_evidence_skills, career_assessments, career_recommendations, optional comparison session/items and admin_audit_logs.

## 6. Recommendation sequence

**Figure: Recommendation sequence diagram**

![Recommendation sequence diagram](diagrams/sequence_recommendation_phase1.png)

Figure 5. Request sequence for generating recommendations.

## 7. Profile setup workflow

**Figure: Student profile workflow**

![Student profile workflow](diagrams/student_profile_workflow_phase1.png)

Figure 6. The student creates a profile with enough data to support analysis.

## 8. Career discovery workflow

**Figure: Career discovery workflow**

![Career discovery workflow](diagrams/student_discovery_workflow_phase1.png)

**Figure: Full student journey**

![Full student journey](diagrams/student_workflow_phase1.png)

Figure 7. The student explores, compares, analyzes and reviews career options.

## 9. Component responsibilities

| Component | Input | Output |
| --- | --- | --- |
| React student interface | User actions and form values | API requests and visual reports |
| Authentication middleware | Session cookie | Authenticated principal and role |
| Profile service | Profile/subject changes | Validated stored profile |
| Skill service | Skill IDs and levels | Student skill inventory |
| Career service | Search/filter requests | Published career profiles and mappings |
| Evidence service | Evidence records and linked skills | Traceable job sample and frequency summaries |
| Recommendation engine | Student profile plus career mappings | Alignment dimensions, rank and explanations |
| Skill gap service | Student skills plus career requirements | Per-skill statuses and weighted coverage |
| Report service | Career and student data | Combined Career Reality Report |
| Admin service | Privileged maintenance requests | Validated catalogue/evidence updates |

## 10. Key design constraints

- The UI never calculates trusted career scores; scoring occurs in backend services.

- Student data queries always include the authenticated user ID.

- Job evidence source metadata must be visible from report/statistic screens.

- The use case “Counsellor reviews a student” is Phase 2 and is intentionally absent from Phase 1 diagrams.

- The UML is a design abstraction; database-specific constraints are defined in the data dictionary.

## 11. Diagram maintenance

The source Graphviz .dot files are included in the documentation package. When modules or relationships change, update the source diagram and re-render the PNG; do not manually edit only the picture. Keep diagram naming aligned with the document figure captions.

## Editable diagram sources

- [class_overview_phase1.dot](diagrams/class_overview_phase1.dot)

- [erd_career_phase1.dot](diagrams/erd_career_phase1.dot)

- [erd_student_phase1.dot](diagrams/erd_student_phase1.dot)

- [sequence_recommendation_phase1.dot](diagrams/sequence_recommendation_phase1.dot)

- [student_discovery_workflow_phase1.dot](diagrams/student_discovery_workflow_phase1.dot)

- [student_profile_workflow_phase1.dot](diagrams/student_profile_workflow_phase1.dot)

- [student_workflow_phase1.dot](diagrams/student_workflow_phase1.dot)

- [use_case_phase1.dot](diagrams/use_case_phase1.dot)

---

# Test Plan & Acceptance Test Catalogue

Phase 1 — Verification strategy, test data and execution records

| Document ID | PP-P1-TEST-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Testing objectives

- Verify every Phase 1 functional requirement and critical user journey.

- Check that score calculations are deterministic, bounded and explainable.

- Confirm student ownership and admin-only authorization.

- Verify job evidence statistics use correct denominators and statuses.

- Check UI usability, responsive behaviour and accessibility basics.

- Prevent Phase 2 features from being represented as delivered Phase 1 functionality.

## 2. Test levels

| Level | Scope | Examples |
| --- | --- | --- |
| Unit | Single functions/components/services. | Score functions, proficiency status, validators, repository helpers. |
| Integration | Multiple modules and database interactions. | Profile + recommendations; career mappings + gap service; evidence + market summary. |
| System / end-to-end | Complete user journeys. | Register → profile → skills/preferences → recommendations → compare → report. |
| Security | Authentication, authorization and input safety. | Student cannot access admin; user A cannot read user B data; injection/XSS checks. |
| Usability | Realistic student tasks. | Find a QA career, understand result, compare with backend. |
| Regression | Re-run after changes. | Core smoke suite on each release candidate. |

## 3. Test environment

| Item | Test setup |
| --- | --- |
| Frontend | React development or production build in current Chrome/Edge/Firefox. |
| Backend | Node.js/Express test environment with test configuration. |
| Database | Dedicated test database seeded with fictional student records and controlled career/evidence dataset. |
| API tool | Postman or automated HTTP test runner. |
| Browser testing | Desktop and mobile viewport checks. |
| Data | No real personal student data in automated tests; use synthetic profiles. |

## 4. Required test data fixtures

- One student with a complete profile and multiple subjects, skills and preference ratings.

- One student with incomplete profile data.

- One student with no recorded skill entries.

- Two student accounts to test ownership isolation.

- One administrator account.

- Six published careers plus one draft/archived career.

- A career with at least five eligible evidence records and one excluded record.

- Skills appearing in multiple evidence records, with both REQUIRED and PREFERRED mention types.

- Career mappings with different target levels and weights.

## 5. Functional test cases

| Test ID | Scenario | Steps / data | Expected result | Requirement |
| --- | --- | --- | --- | --- |
| TC-001 | Register valid student | Submit unused email, valid name and password. | 201; STUDENT account created; session or next-step response shown. | FR-AUTH-01 |
| TC-002 | Duplicate email registration | Register using existing email with different letter case. | 409 duplicate error; no second account. | FR-AUTH-02 |
| TC-003 | Public role escalation attempt | Include role=ADMIN in registration payload. | Role ignored/rejected; account is not ADMIN. | FR-AUTH-07 |
| TC-004 | Invalid login | Submit wrong password. | 401 generic authentication message; no session. | FR-AUTH-04 |
| TC-005 | Logout invalidates session | Log in, log out, repeat protected request with old cookie. | Protected request returns 401. | FR-AUTH-05 |
| TC-006 | Save academic profile | Save degree, semester, hours and budget values within range. | Profile persists and is returned accurately. | FR-PROF-01..03 |
| TC-007 | Reject invalid semester | Submit semester 0 or 13. | Validation error; old value remains unchanged. | FR-PROF-02 |
| TC-008 | Add completed subject | Add active subject with COMPLETED status. | One student_subject row appears. | FR-PROF-04 |
| TC-009 | Prevent duplicate subject | Add same subject twice for same student. | Duplicate blocked or existing row updated; no duplicate rows. | FR-PROF-05 |
| TC-010 | Add skill | Add an active skill at level 3. | Skill appears as self-reported Intermediate. | FR-SKILL-02,04 |
| TC-011 | Reject invalid proficiency | Submit level 0 or 5. | Validation error; no invalid row. | FR-SKILL-02 |
| TC-012 | Student ownership check | Student A requests Student B skill record. | 403 or 404; no data disclosed. | FR-AUTH-06 |
| TC-013 | Save preferences | Submit at least three valid interest ratings and three valid activity ratings. | Ratings persist and are grouped by tag type; minimum counts are enforced for matching. | FR-PREF-01..03 |
| TC-014 | Career catalogue search | Search published role by title/category. | Matching published careers returned; draft excluded. | FR-CAR-01,02 |
| TC-015 | Career detail content | Open a published career. | Responsibilities, entry tasks, education, mappings and evidence displayed. | FR-CAR-03 |
| TC-016 | Evidence traceability | Open evidence record from career page. | Source name, URL, collection date and status visible. | FR-EVID-01 |
| TC-017 | Evidence frequency denominator | Use 5 eligible records, one excluded record; skill appears in 3 eligible records. | Display 3/5 (60%) with sample size 5; excluded record not counted. | FR-EVID-04,05 |
| TC-018 | No national-market overclaim | Inspect market-summary wording. | UI labels value as project sample, not national prevalence. | FR-EVID-06 |
| TC-019 | Generate recommendation | Use complete profile and published careers. | Assessment saved; ranked rows include algorithm version and explanations. | FR-REC-01,04,05 |
| TC-020 | Missing recommendation dimension | Remove all activity preferences. | Activity shown NOT_ENOUGH_DATA; available dimensions re-normalized and disclosed. | FR-REC-02,05 |
| TC-021 | Alignment/readiness separation | Use high interest and low skill proficiency. | Alignment may be high while skill coverage remains lower; separate labels. | FR-REC-03,06 |
| TC-022 | Compare two careers | Submit two distinct published career IDs. | Comparison matrix returned. | FR-CAR-04 |
| TC-023 | Reject four careers | Submit four distinct career IDs. | 400/422; no comparison created. | FR-CAR-04 |
| TC-024 | Skill gap meets target | Student level equals target level. | Status MEETS_TARGET. | FR-GAP-01,02 |
| TC-025 | Skill gap developing | Student level below target. | Status DEVELOPING with levels shown. | FR-GAP-02 |
| TC-026 | Skill gap missing | No student record exists. | Status MISSING; not a zero-level student row. | FR-GAP-02 |
| TC-027 | Weighted coverage | Use two skills with different weights and proficiency ratios. | Calculated coverage matches documented formula. | FR-GAP-03 |
| TC-028 | Career Reality Report | Open report for a selected career. | Academic mapping, preference scores, skill gaps and dated evidence appear. | FR-REPORT-01..03 |
| TC-029 | Student cannot maintain career | Call admin career update as STUDENT. | 403; career unchanged. | FR-ADMIN-01 |
| TC-030 | Admin creates evidence | Admin submits valid evidence and linked skills. | Evidence and links save atomically; audit entry recorded. | FR-ADMIN-03 |
| TC-031 | Invalid source URL | Admin submits javascript: URL. | Validation rejects unsupported scheme. | FR-EVID-01 |
| TC-032 | Draft career hidden | Student requests draft career by ID. | 404/not available. | FR-CAR-01 |
| TC-033 | Archived skill mapping | Archive a skill already referenced by historical mappings. | No destructive FK break; student selection disabled; historical record retained. | FR-ADMIN-02,05 |
| TC-034 | Responsive dashboard | Open student workflow at mobile viewport. | No horizontal overflow for primary tasks; controls remain usable. | NFR-COMP-01 |
| TC-035 | XSS input handling | Enter HTML/script-like text in profile note. | Text displayed safely; script does not execute. | NFR-SEC-03 |
| TC-036 | SQL injection attempt | Submit SQL metacharacters in search input. | Query remains parameterized; no unauthorized data returned. | NFR-SEC-03 |

## 6. Scoring unit tests

| Test | Fixture | Expected |
| --- | --- | --- |
| Academic completed | One mapped subject; weight 2; COMPLETED. | 100 for that dimension. |
| Academic in progress | One mapped subject; weight 2; IN_PROGRESS. | 50 for that dimension. |
| Academic planned | One mapped subject; weight 2; PLANNED. | 0 contribution; dimension may be zero if this is the only mapping. |
| Interest rating | Complete the minimum three mapped interest ratings, all rated 4/5. | 80 for the dimension. |
| Activity rating | At least three mapped activity tags are rated 5/5. | 100 for the dimension. |
| Missing dimension | Fewer than three activity ratings. | NULL / NOT_ENOUGH_DATA; remaining alignment weights re-normalized. |
| Skill exact target | Student level 3, target 3. | 1.0 weighted ratio; MEETS_TARGET. |
| Skill above target | Student level 4, target 3. | 1.0 capped ratio; MEETS_TARGET. |
| Skill below target | Student level 2, target 4. | 0.5 ratio; DEVELOPING. |
| Skill missing | No student skill row. | 0 ratio; MISSING. |

## 7. Security test checklist

- Student routes reject missing/expired sessions.

- Student A cannot read, update or delete Student B records by changing IDs.

- Student role cannot call admin routes.

- Public registration cannot assign privileged roles.

- Password hashes are not returned by any endpoint or written to logs.

- SQL injection strings do not alter query structure.

- User-provided text is escaped/safely rendered.

- Cookie settings and CSRF controls are enabled for deployed cookie sessions.

- Rate limits exist on authentication endpoints.

- Error responses do not expose stack traces or secrets.

## 8. Usability test script

- Ask participant to create a student account using test data.

- Ask them to complete degree/semester and add three subjects.

- Ask them to add three skills with different levels and rate several preferences.

- Ask them to find QA Engineer and Backend Developer.

- Ask them to generate recommendations and explain what the alignment score means.

- Ask them to compare the two careers.

- Ask them to find one missing skill and locate the evidence/source supporting a market statistic.

- Record completion, confusion points and participant feedback; do not lead the participant to the answer.

## 9. Defect severity

| Severity | Definition | Release rule |
| --- | --- | --- |
| Critical | Data exposure, privilege escalation, data corruption or unusable core workflow. | Must fix before presentation. |
| High | Major requirement broken with no practical workaround. | Must fix before presentation. |
| Medium | Partial failure or confusing output with workaround. | Fix if time; otherwise document. |
| Low | Minor visual or wording defect. | May be deferred with supervisor awareness. |

## 10. Test execution record template

| Field | Record |
| --- | --- |
| Build / commit | [Commit hash] |
| Environment | [OS, browser, Node version, MySQL version] |
| Tester | [Name] |
| Test ID | [TC-xxx] |
| Actual result | [Observed result] |
| Status | PASS / FAIL / BLOCKED |
| Defect ID | [If failed] |
| Evidence | [Screenshot/log reference] |
| Retest date | [Date] |

## 11. Exit criteria

- All critical test cases pass.

- No open Critical or High severity defects.

- Recommendation calculation unit tests pass with boundary and missing-data cases.

- Ownership and role security tests pass.

- Job evidence statistics display correct sample numerator/denominator.

- At least one usability test has been conducted and findings recorded, if participant access is available.

- Database backup and restore have been tested.

---

# Phase 1 Development & Setup Guide

From an empty folder to a working PathProof Phase 1 application

| Document ID | PP-P1-DEV-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Development objective

This guide converts the approved Phase 1 scope into a practical build order. It assumes the project starts from an empty repository and targets a complete working student journey before the first presentation.

## 2. Recommended tools and prerequisites

| Tool | Purpose / setup note |
| --- | --- |
| Node.js LTS | Use a supported LTS release; verify node --version and npm --version. |
| MySQL 8.x | Local relational database; create a dedicated pathproof_db schema and local user. |
| VS Code | Editor; install ESLint/Prettier and SQL support if useful. |
| Git + GitHub | Version control; use feature branches and meaningful commits. |
| Postman | API endpoint and authorization testing. |
| MySQL Workbench | Inspect schema, relationships and seed records. |
| Figma / diagrams.net | Optional UI wireframes and supplemental diagrams. |

## 3. Repository layout

```text
pathproof/
  client/src/ (app, components, layouts, hooks, services, styles)
  client/src/features/ (auth, profile, academics, skills, preferences)
  client/src/features/ (careers, recommendations, comparison, skill-gap)
  client/src/features/ (reports, admin)
  server/src/ (config, middleware, shared, app.js, server.js)
  server/src/modules/ (auth, profile, academics, skills, preferences)
  server/src/modules/ (careers, evidence, recommendations, skill-gap)
  server/src/modules/ (reports, admin)
  server/tests/
  database/migrations/ and database/seeds/
  docs/  .gitignore  README.md  .env.example
```

## 4. Build order and completion checkpoints

### Step 1 — Project foundation

Create Git repository; initialize client/server folders; add scripts; configure lint/format; create README and .env.example.

| Checkpoint  Deliverable: both client and server start locally; health endpoint responds. |
| --- |

### Step 2 — Database baseline

Create pathproof_db; write migrations for users, profiles, academic subjects, skills and student records; add stable seed data.

| Checkpoint  Deliverable: database can be built from migrations and seeded repeatedly. |
| --- |

### Step 3 — Authentication and roles

Implement registration/login/logout, sessions, password hashing and STUDENT/ADMIN middleware. Provision admin securely.

| Checkpoint  Deliverable: protected student/admin routes and auth tests. |
| --- |

### Step 4 — Student profile and academics

Implement profile form, degree/semester/constraints and subject CRUD/status.

| Checkpoint  Deliverable: profile persists and can be edited. |
| --- |

### Step 5 — Skills and preferences

Implement skill catalogue, student skill CRUD, proficiency, interest/activity tags and preference ratings.

| Checkpoint  Deliverable: student profile has enough structured inputs for matching. |
| --- |

### Step 6 — Career catalogue

Seed six career profiles; implement career search/detail; create career skill, subject and tag mappings.

| Checkpoint  Deliverable: career pages show structured requirements. |
| --- |

### Step 7 — Job Reality Engine

Curate public job/internship observations; add source, collection/check dates and skill links; implement sample counts.

| Checkpoint  Deliverable: career market evidence is traceable and sample-limited. |
| --- |

### Step 8 — Scoring services

Implement academic, interest, activity and skill coverage calculations as pure testable functions; add versioning and explanations.

| Checkpoint  Deliverable: deterministic calculation unit tests pass. |
| --- |

### Step 9 — Recommendations and comparison

Implement recommendation API/UI; save assessment and ranked results; compare two or three roles.

| Checkpoint  Deliverable: student can generate and compare career paths. |
| --- |

### Step 10 — Gap analyzer and report

Implement per-skill statuses, weighted coverage and combined Career Reality Report.

| Checkpoint  Deliverable: end-to-end Phase 1 value proposition works. |
| --- |

### Step 11 — Admin data management

Build CRUD for careers, categories, skills, subjects, preference tags, mappings and job evidence; audit privileged edits.

| Checkpoint  Deliverable: dataset can be maintained without SQL manual edits. |
| --- |

### Step 12 — Stabilize and present

Run test plan, resolve critical/high defects, check responsive layout, back up/restore database and prepare demo data.

| Checkpoint  Deliverable: release candidate and presentation evidence. |
| --- |

## 5. Environment configuration

```text
# server/.env.example (illustrative names; never commit real secrets)
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=pathproof_db
DB_USER=pathproof_dev
DB_PASSWORD=change_me_locally
SESSION_SECRET=replace_with_long_random_secret
COOKIE_SECURE=false
```

Copy .env.example to .env for local use and replace all placeholders. Add .env to .gitignore. In production, use HTTPS, COOKIE_SECURE=true, strong secrets and deployment-managed environment variables.

## 6. Suggested local setup sequence

- Install Node.js LTS, MySQL and Git; confirm commands work in the terminal.

- Create a private or course-approved Git repository named pathproof.

- Initialize the React client and Express server in separate folders.

- Create a MySQL user limited to the project database; do not use the MySQL root account from the application.

- Run database migrations, then seed reference data.

- Start the API and verify GET /api/v1/health returns a non-sensitive health status.

- Start the React development server and configure the API base URL.

- Register a student and use a controlled setup script to provision an administrator.

- Run the complete student journey against the local database.

## 7. Suggested backend service interfaces

```text
// Pseudocode contracts: keep these functions independent of Express.
profileService.getOwnProfile(userId)
profileService.upsertOwnProfile(userId, input)
studentSkillService.upsertSkill(userId, skillId, proficiencyLevel)
preferenceService.replacePreferences(userId, preferences)
careerService.searchPublishedCareers(filters)
evidenceService.getCareerMarketSummary(careerId, samplePolicy)
recommendationService.generateForStudent(userId)
skillGapService.analyze(userId, careerId)
reportService.getCareerRealityReport(userId, careerId)
adminService.updateCareerMappings(adminUserId, careerId, mappings)
```

## 8. Scoring implementation checklist

- Write calculation functions with no database or HTTP dependencies.

- Unit test each component score for completed/in-progress/planned, ratings and no-response cases.

- Normalize remaining weights only when a dimension is genuinely unavailable.

- Never substitute zero for missing profile data without an explicit business rule.

- Use decimal precision consistently and round only for display/storage policy.

- Keep alignment separate from skill coverage.

- Generate explanations from the same inputs used for the result.

- Record algorithm_version and computed_at.

## 9. Dataset curation protocol

- Select public sources that provide accessible entry-level or internship postings.

- Record the exact URL, source name, title, organization if available, location, work mode, experience level and posting date if stated.

- Record collected_at and last_checked_at; do not assume a posting remains open.

- Map only skills that are stated or clearly supported by the posting; distinguish REQUIRED and PREFERRED.

- Use canonical skill names from the PathProof taxonomy; do not create duplicate synonyms unnecessarily.

- Keep a short internal note explaining ambiguous mappings.

- Exclude inaccessible, duplicate or irrelevant records from the eligible statistics and disclose the exclusion policy.

- Report sample count and date range whenever frequency statistics are shown.

- Do not scrape sites against their terms or reproduce full copyrighted descriptions; store structured facts and source links.

## 10. UI implementation order

| Order | Screen | Must work before moving on |
| --- | --- | --- |
| 1 | Register / Login | Valid/invalid states; session persistence; logout. |
| 2 | Student profile setup | Degree, semester, subjects and learning constraints save. |
| 3 | Skills and preferences | Student can edit their own records. |
| 4 | Career Explorer | Search/filter/detail and mapped requirements. |
| 5 | Career evidence view | Source link, date, status and sample statistics. |
| 6 | Recommendations | Ranked results, explanations and missing-input warnings. |
| 7 | Career comparison | 2–3 careers; student-specific skill coverage. |
| 8 | Skill gap report | Matched/developing/missing with target levels. |
| 9 | Career Reality Report | Combined, readable, source-traceable report. |
| 10 | Admin | Data can be maintained through protected UI. |

## 11. Git and collaboration rules

- Keep main branch stable; create feature branches such as feat/profile, feat/recommendations and fix/ownership-check.

- Make commits that describe one logical change.

- Review API/schema changes before merging.

- Never commit .env, database dumps with personal data, passwords or tokens.

- Keep README instructions updated when setup steps change.

- Tag the first presentation build as phase1-demo or an equivalent release tag.

## 12. Final presentation checklist

- Create a demo student account and an admin account using controlled setup.

- Seed the six career records and the actual curated evidence sample.

- Verify all displayed sample counts and source links.

- Prepare a student profile with subjects, skills and preferences.

- Demonstrate recommendations, comparison, gap analysis and Career Reality Report.

- Show an admin workflow that updates one career mapping or evidence record.

- Show at least one security test: student denied access to admin route.

- Prepare architecture, ERD and use-case diagrams.

- Bring a database backup and ensure the demo environment can be reset.

- Clearly explain that practical challenges, roadmaps, portfolio and counsellor workflows are Phase 2.

## 13. Definition of done

A Phase 1 module is done only when its UI, API, validation, authorization, database constraints, error states and tests are complete; its documentation is updated; and the feature has been reviewed in the integrated application. A screenshot of a static page is not evidence of a working feature.
