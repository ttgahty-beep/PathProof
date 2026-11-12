# Design Pattern 2: Factory Pattern — EvidenceFactory

## 1. Intent & Problem Statement
Students submit five distinct varieties of evidence in PathProof: practical code deliverables, open-source GitHub pull requests, accredited university coursework, industry certifications, and academic research papers. Each type requires completely distinct validation rules, weight multiplier calculations, and verification criteria.

The **Factory Pattern** decouples the caller from concrete evidence processor classes, encapsulating instantiation inside `EvidenceFactory.getProcessor(type)`.

## 2. UML Class Diagram
```
                          +-------------------------+
                          |   <<interface>>         |
                          |   IEvidenceProcessor    |
                          +-------------------------+
                          | + validate()            |
                          | + calculateWeight()     |
                          | + formatDetails()       |
                          | + processEvidence()     |
                          +-------------------------+
                                       ▲
        ┌───────────────┬──────────────┼──────────────┬──────────────┐
        │               │              │              │              │
+---------------+ +---------------+ +---------------+ +---------------+ +---------------+
|ProjectEvidence| |GitHubEvidence | |CourseworkEvid | |CertEvidence   | |ResearchEvid   |
|  Processor    | |  Processor    | |  Processor    | |  Processor    | |  Processor    |
+---------------+ +---------------+ +---------------+ +---------------+ +---------------+
                                       ▲
                                       │ creates
                          +-------------------------+
                          |    EvidenceFactory      |
                          +-------------------------+
                          | + static getProcessor() |
                          | + static process()      |
                          +-------------------------+
```

## 3. Specialized Processors
1. **`ProjectEvidenceProcessor`**: Validates project architecture and live demo URLs. Awards high practical weighting (0.85 - 1.00).
2. **`GitHubEvidenceProcessor`**: Verifies valid GitHub URL structure, repository documentation, and commit depth.
3. **`CourseworkEvidenceProcessor`**: Evaluates HEC-aligned course codes, credit hours, and semester grade performance.
4. **`CertificationEvidenceProcessor`**: Validates credential IDs against authorized cloud providers (AWS, GCP, CKA).
5. **`ResearchEvidenceProcessor`**: Validates peer-reviewed publication abstracts, DOI links, and indexed conference tiers (IEEE, ACM, Springer).

## 4. Verification & Testing
Validated in `src/scoring/patterns.test.ts`:
- Asserts factory instantiation for all 5 processors.
- Rejects unsupported types with descriptive exception.
- Tests validation logic and weight calculations.
