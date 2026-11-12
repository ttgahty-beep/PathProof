---

title: "Phase 1 Development & Setup Guide"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# Phase 1 Development & Setup Guide

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

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
