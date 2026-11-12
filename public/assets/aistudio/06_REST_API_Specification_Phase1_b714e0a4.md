---

title: "REST API Specification"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# REST API Specification

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

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
