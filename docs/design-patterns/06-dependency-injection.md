# Architectural Pattern: Dependency Injection & Service Layer

## 1. Intent & Problem Statement
When services and API controllers instantiate their own dependencies using hardcoded `new Repository()` calls, the system becomes rigid, impossible to unit test without database mocks, and prone to circular dependencies. **Dependency Injection (DI)** decouples object creation from object behavior by passing dependencies (repositories, strategies, event subjects) via constructor injection.

## 2. UML Architecture Diagram
```
                     +------------------------------------------------+
                     |               ServiceContainer                 |
                     +------------------------------------------------+
                     | + userRepository: IUserRepository              |
                     | + studentRepository: IStudentRepository        |
                     | + careerRepository: ICareerRepository          |
                     | + competencyRepository: ICompetencyRepository  |
                     | + evidenceRepository: IEvidenceRepository      |
                     | + verificationRepository: IVerificationRepo    |
                     | + roadmapRepository: IRoadmapRepository        |
                     | + notificationRepository: INotificationRepo    |
                     | ---------------------------------------------- |
                     | + authService: PatternAuthenticationService    |
                     | + evidenceService: PatternEvidenceService      |
                     | + verificationService: PatternVerificationServ |
                     | + readinessService: PatternReadinessService    |
                     | + roadmapService: PatternRoadmapService        |
                     | + notificationService: PatternNotificationServ |
                     +------------------------------------------------+
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         +--------------------------+                   +--------------------------+
         |     REST API Router      |                   |   Unit & E2E Tests       |
         |     src/server/api.ts    |                   | src/scoring/patterns.test|
         +--------------------------+                   +--------------------------+
```

## 3. Implementation Details
Located in `src/patterns/di/ServiceContainer.ts`:
- **Centralized Composition Root:** The `ServiceContainer` is the single point where `DatabaseConnectionManager`, all 8 Repositories, and domain services are instantiated and wired together.
- **Constructor Injection:**
  ```typescript
  export class PatternVerificationService {
    constructor(
      private verificationRepo: IVerificationRepository,
      private evidenceRepo: IEvidenceRepository,
      private notifRepo: INotificationRepository,
      private eventSubject: VerificationEventSubject
    ) {}
  }
  ```
- **Test Isolation:** Enables tests to inject mock repositories or inspect observer side-effects without spinning up an external database.

## 4. Verification & Testing
Validated in `src/scoring/patterns.test.ts`:
- Asserts that `ServiceContainer.getInstance()` properly wires repositories into `verificationService`.
- Verifies cross-pattern integration where verification triggers database mutations and notifies 4 observers.
