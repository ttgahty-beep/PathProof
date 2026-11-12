---

title: "Test Plan & Acceptance Test Catalogue"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# Test Plan & Acceptance Test Catalogue

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

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
