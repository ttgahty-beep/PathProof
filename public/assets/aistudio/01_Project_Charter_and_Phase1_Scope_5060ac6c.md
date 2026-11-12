---

title: "Project Charter & Phase 1 Scope"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# Project Charter & Phase 1 Scope

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

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
