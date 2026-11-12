---

title: "Product Requirements Document"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# Product Requirements Document

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

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
