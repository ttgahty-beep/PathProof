---

title: "UML & System Workflow Design"

project: "PathProof"

phase: "Phase 1 — Career Discovery & Intelligence"

format: "Markdown"

version: "1.0"

---

# UML & System Workflow Design

> PathProof — Phase 1: Career Discovery & Intelligence  
> Prepared for the Software Construction & Development semester project.  
> Student / Team: **[Insert names]** · Supervisor: **[Insert name]**

Phase 1 — Use cases, domain classes, ERDs and interaction flows

| Document ID | PP-P1-UML-001 |
| --- | --- |
| Version | 1.0 |
| Prepared | 5 November 2026 |
| Project status | Proposed specification — subject to supervisor approval |

## 1. Purpose

This document provides the core diagrams needed before implementation. The diagrams are high-level design views; the database data dictionary and SRS define the authoritative fields and rules.

## 2. Use case diagram

**Figure: Use case diagram**

![Use case diagram](diagrams/use_case_phase1.png)

Figure 1. Student and Administrator interactions with Phase 1.

### 2.1 Actor summaries

| Actor | Primary use cases |
| --- | --- |
| Student | Register/login; complete profile; manage subjects, skills and preferences; explore careers; view job evidence; generate recommendations; compare careers; view skill gaps and Career Reality Report. |
| Administrator | Manage accounts/status; maintain categories, careers, skills, subjects and preference tags; curate job evidence and mappings; inspect data quality. |

## 3. Domain class diagram

**Figure: Domain class overview**

![Domain class overview](diagrams/class_overview_phase1.png)

Figure 2. Simplified domain-class view. Junction entities represent many-to-many mappings.

### 3.1 Core class responsibilities

| Class / entity | Responsibility | Representative operations |
| --- | --- | --- |
| User | Account identity and role. | register, authenticate, deactivate |
| StudentProfile | Academic stage and learning constraints. | updateProfile, validateSemester |
| StudentSubject | Student-to-subject relation and status. | setStudyStatus |
| StudentSkill | Self-reported skill and proficiency. | setProficiency |
| Career | Career catalogue content. | publish, archive |
| CareerSkill | Required skill, target level and weight. | validateRequirement |
| JobEvidence | Dated source observation. | validateSource, updateVerification |
| CareerAssessment | One recommendation calculation event. | createAssessment |
| CareerRecommendation | One career result with component scores. | explain, rank |

## 4. Student ERD

**Figure: Student and academic ERD**

![Student and academic ERD](diagrams/erd_student_phase1.png)

Figure 3. Student profile, academic subjects, skills and preferences.

## 5. Career and evidence ERD

**Figure: Career and job-evidence ERD**

![Career and job-evidence ERD](diagrams/erd_career_phase1.png)

Figure 4. Careers, skill/subject/tag mappings, job evidence and recommendations.

The full logical schema includes the additional tables defined in the Database Design and Data Dictionary document: student_profiles, academic_subjects, student_subjects, skills, student_skills, career_categories, careers, career_skills, career_subjects, interest_tags, student_preferences, career_interest_tags, job_evidence, job_evidence_skills, career_assessments, career_recommendations, optional comparison session/items and admin_audit_logs.

## 6. Recommendation sequence

**Figure: Recommendation sequence diagram**

![Recommendation sequence diagram](diagrams/sequence_recommendation_phase1.png)

Figure 5. Request sequence for generating recommendations.

## 7. Profile setup workflow

**Figure: Student profile workflow**

![Student profile workflow](diagrams/student_profile_workflow_phase1.png)

Figure 6. The student creates a profile with enough data to support analysis.

## 8. Career discovery workflow

**Figure: Career discovery workflow**

![Career discovery workflow](diagrams/student_discovery_workflow_phase1.png)

**Figure: Full student journey**

![Full student journey](diagrams/student_workflow_phase1.png)

Figure 7. The student explores, compares, analyzes and reviews career options.

## 9. Component responsibilities

| Component | Input | Output |
| --- | --- | --- |
| React student interface | User actions and form values | API requests and visual reports |
| Authentication middleware | Session cookie | Authenticated principal and role |
| Profile service | Profile/subject changes | Validated stored profile |
| Skill service | Skill IDs and levels | Student skill inventory |
| Career service | Search/filter requests | Published career profiles and mappings |
| Evidence service | Evidence records and linked skills | Traceable job sample and frequency summaries |
| Recommendation engine | Student profile plus career mappings | Alignment dimensions, rank and explanations |
| Skill gap service | Student skills plus career requirements | Per-skill statuses and weighted coverage |
| Report service | Career and student data | Combined Career Reality Report |
| Admin service | Privileged maintenance requests | Validated catalogue/evidence updates |

## 10. Key design constraints

- The UI never calculates trusted career scores; scoring occurs in backend services.

- Student data queries always include the authenticated user ID.

- Job evidence source metadata must be visible from report/statistic screens.

- The use case “Counsellor reviews a student” is Phase 2 and is intentionally absent from Phase 1 diagrams.

- The UML is a design abstraction; database-specific constraints are defined in the data dictionary.

## 11. Diagram maintenance

The source Graphviz .dot files are included in the documentation package. When modules or relationships change, update the source diagram and re-render the PNG; do not manually edit only the picture. Keep diagram naming aligned with the document figure captions.

## Editable diagram sources

- [class_overview_phase1.dot](diagrams/class_overview_phase1.dot)

- [erd_career_phase1.dot](diagrams/erd_career_phase1.dot)

- [erd_student_phase1.dot](diagrams/erd_student_phase1.dot)

- [sequence_recommendation_phase1.dot](diagrams/sequence_recommendation_phase1.dot)

- [student_discovery_workflow_phase1.dot](diagrams/student_discovery_workflow_phase1.dot)

- [student_profile_workflow_phase1.dot](diagrams/student_profile_workflow_phase1.dot)

- [student_workflow_phase1.dot](diagrams/student_workflow_phase1.dot)

- [use_case_phase1.dot](diagrams/use_case_phase1.dot)
