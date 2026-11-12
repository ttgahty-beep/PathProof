# Design Pattern 5: Repository Pattern — Relational Data Access

## 1. Intent & Problem Statement
Mixing direct SQL queries or database-specific syntax within web route handlers or UI components creates tight coupling, security vulnerabilities, and code duplication. The **Repository Pattern** mediates between the domain/business logic and the data mapping layers using a collection-like interface for accessing domain objects.

## 2. Implemented Repositories
Located in `src/patterns/repository/`:

1. **`UserRepository`**:
   - Manages the `users` table.
   - Enforces email uniqueness.
   - Handles bcrypt password hashing (`$2b$10$...`) and safe authentication verification.

2. **`StudentRepository`**:
   - Manages `student_profiles` joined with user records.
   - Handles semester progress, weekly learning hours, and academic preferences.

3. **`CareerRepository`**:
   - Manages `career_paths` and junction table `career_competencies`.
   - Filters published careers and retrieves weighted target levels.

4. **`CompetencyRepository`**:
   - Manages `competencies` and `skill_assessments`.
   - Enforces 1-4 proficiency ratings and assessment audit states (`SELF_REPORTED`, `PEER_REVIEWED`, `FACULTY_VERIFIED`).

5. **`EvidenceRepository`**:
   - Manages `evidence_items` and `evidence_skills`.
   - Enforces student ownership security: students cannot update or delete evidence belonging to others.
   - Uses transactions (`DatabaseConnectionManager.transaction`) for multi-table inserts.

6. **`VerificationRepository`**:
   - Manages `reviewers` and `evidence_verifications`.
   - Stores reviewer feedback, status transitions, and timestamps.

7. **`RoadmapRepository`**:
   - Manages `roadmap_items` ordered by target week.
   - Handles milestone completion and deliverable tracking.

8. **`NotificationRepository`**:
   - Manages `notifications` and `activity_history`.
   - Records audit actions with JSON metadata for university compliance.

## 3. SQL Injection Prevention
All repository queries strictly use **parameterized queries** (`?` placeholders) passed to `mysql2/promise`, eliminating SQL injection risks:
```typescript
const rows = await this.db.query<UserEntity>(
  'SELECT * FROM users WHERE email = ? LIMIT 1',
  [email.toLowerCase().trim()]
);
```

## 4. Verification & Testing
Validated in `src/scoring/patterns.test.ts`:
- Verifies user lookup and bcrypt password verification.
- Enforces student ownership security on update/delete attempts.
- Verifies parameterized query handling across repositories.
