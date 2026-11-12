# Design Pattern 3: Observer Pattern — EvidenceVerificationEvent

## 1. Intent & Problem Statement
When a faculty member (e.g., Dr. Shahbaz) approves or requests revisions on student evidence, multiple independent subsystems must react simultaneously:
1. Career readiness scores must recalculate.
2. The student must receive an immediate notification.
3. An immutable audit record must be recorded in `activity_history`.
4. Linked roadmap milestones must be marked as fulfilled.

Hardcoding these side effects inside the verification controller causes tight coupling and fragile code. The **Observer Pattern** creates a one-to-many dependency where `VerificationEventSubject` broadcasts `VerificationEvent` to all subscribed observers.

## 2. UML Sequence Diagram
```
Faculty / Reviewer          VerificationService     VerificationEventSubject        Observers (4)
        │                            │                         │                         │
        │── reviewEvidence(APPROVED)─>│                         │                         │
        │                            │── update status in DB ──>│                         │
        │                            │                         │                         │
        │                            │── notifyObservers(event)─>│                         │
        │                            │                         │── onEvidenceChanged() ──>│ [ReadinessObserver]
        │                            │                         │── onEvidenceChanged() ──>│ [NotificationObserver]
        │                            │                         │── onEvidenceChanged() ──>│ [ActivityHistoryObserver]
        │                            │                         │── onEvidenceChanged() ──>│ [RoadmapObserver]
        │                            │<──── notifiedCount = 4 ─│                         │
        │<── 200 OK (verified) ──────│                         │                         │
```

## 3. Registered Observers
1. **`ReadinessObserver`**: Triggers re-computation of the student's verified skills and readiness scores.
2. **`NotificationObserver`**: Formats contextual student notifications (e.g., "Evidence Approved! 🎉 Reviewed by Dr. Shahbaz Akhtar").
3. **`ActivityHistoryObserver`**: Writes an audit log entry in the `activity_history` table for accreditation compliance.
4. **`RoadmapObserver`**: Updates roadmap items linked to this evidence deliverable.

## 4. Verification & Testing
Validated in `src/scoring/patterns.test.ts`:
- Verifies that all 4 observers receive broadcast events.
- Rejects malformed events missing critical identifiers (Action Safety Gate).
