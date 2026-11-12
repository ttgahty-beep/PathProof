---

title: "Software Architecture & Design"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# Software Architecture & Design

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

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
