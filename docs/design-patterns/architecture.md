# PathProof — Comprehensive Software Architecture & Design Patterns Specification

## Executive Summary
This document specifies the software architecture, design patterns, and database tier implemented for the **PathProof Career Intelligence Platform** to satisfy university Software Construction & Development (SCD) requirements.

The architecture synthesizes:
1. **Singleton Pattern**: `DatabaseConnectionManager` (centralized MySQL connection pool).
2. **Factory Pattern**: `EvidenceFactory` (specialized processors for Project, GitHub, Coursework, Certification, and Research).
3. **Observer Pattern**: `EvidenceVerificationEvent` (decoupled notification of Readiness, Notification, ActivityHistory, and Roadmap observers).
4. **Strategy Pattern**: `CareerReadinessStrategy` (differentiated readiness scoring across 5 career tracks).
5. **Repository Pattern**: 8 domain repositories encapsulating queries for 15 MySQL tables.
6. **Dependency Injection**: `ServiceContainer` orchestrating clean separation of concerns.

---

## 1. End-to-End Workflow Diagram: Evidence Verification Journey
Below is an end-to-end architectural workflow demonstrating how all five design patterns interact in a single business transaction:

```
[Student UI]
     │
     │ 1. Submits Evidence (e.g., GitHub Repo URL)
     ▼
[EvidenceService] ─────────► [EvidenceFactory] (Factory Pattern)
     │                             │
     │                             ├─ Resolves GitHubEvidenceProcessor
     │                             ├─ Validates GitHub URL & metadata
     │                             └─ Computes weight multiplier (0.95)
     │
     │ 2. Persists via Transaction
     ▼
[EvidenceRepository] ──────► [DatabaseConnectionManager] (Singleton Pattern)
                                   │
                                   └─ Executes parameterized INSERT in MySQL pool
                                   
───────────────────────────────────────────────────────────────────────────────

[Faculty / Reviewer Portal]
     │
     │ 3. Reviews & Approves Evidence with Feedback
     ▼
[VerificationService]
     │
     │ 4. Updates Status & Writes Audit Record
     ▼
[VerificationRepository] ──► [DatabaseConnectionManager] (Singleton Pattern)
     │
     │ 5. Dispatches VerificationEvent
     ▼
[VerificationEventSubject] (Observer Pattern)
     │
     ├─► [ReadinessObserver] ───────► [CareerReadinessContext] (Strategy Pattern)
     │                                     │
     │                                     └─ Calculates updated Readiness Score
     │                                        using FullStackReadinessStrategy
     │
     ├─► [NotificationObserver] ────► [NotificationRepository] (Repository Pattern)
     │                                     │
     │                                     └─ Inserts student in-app notification
     │
     ├─► [ActivityHistoryObserver] ──► [NotificationRepository]
     │                                     │
     │                                     └─ Records immutable audit trail
     │
     └─► [RoadmapObserver] ─────────► [RoadmapRepository]
                                           │
                                           └─ Marks milestone completed
```

---

## 2. Relational Schema Summary (15 Tables)
1. `users`: Authentication records with bcrypt password hashes, roles (STUDENT, ADMIN, REVIEWER).
2. `student_profiles`: University degree, semester, weekly study hours, budget, learning preferences.
3. `career_paths`: 6 published careers with salary ranges (PKR) and summaries.
4. `competencies`: Standardized skills categorized into Frontend, Backend, Database, AI/ML, DevOps, Cloud.
5. `career_competencies`: Junction table defining target levels (1-4) and importance weights.
6. `skill_assessments`: Student proficiency ratings with verification states (`FACULTY_VERIFIED`, `PEER_REVIEWED`).
7. `evidence_items`: Student deliverables categorized into 5 evidence types.
8. `evidence_skills`: Junction linking evidence to claimed competencies.
9. `reviewers`: Faculty and industry reviewer profiles.
10. `evidence_verifications`: Immutable records of review decisions, status transitions, and reviewer notes.
11. `roadmap_items`: Time-bound milestones with target weeks, deliverables, and completion status.
12. `notifications`: In-app student alerts with read status and references.
13. `activity_history`: Detailed audit log entries with JSON metadata.
14. `copilot_conversations`: Conversation sessions with student users.
15. `copilot_messages`: Message history, action payloads, and safety flags.

---

## 3. Security, Authorization & Integrity
- **Password Protection**: Passwords hashed with bcrypt salt rounds = 10.
- **SQL Injection Immunity**: 100% of queries use parameterized prepared statements.
- **Role-Based Access Control (RBAC)**: Enforced via `requireAuth`, `requireStudent`, and `requireAdmin` middlewares.
- **Student Ownership Checks**: Verified in `EvidenceRepository`—cross-student tampering is blocked with strict exceptions.
- **Action Safety Gate**: Unapproved verification transitions and missing identifiers are rejected before observer dispatch.

---

## 4. Test Suite Verification
All 39 automated tests run via `npm test` and pass without warnings:
- Singleton pool configuration and instance equality.
- Factory processor instantiation and weight calculations.
- Observer broadcast integrity across 4 distinct observers.
- Strategy selection and differentiated weighting between FullStack and AI tracks.
- Repository CRUD operations, student ownership security, and bcrypt verification.
