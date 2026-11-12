# Design Pattern 4: Strategy Pattern — CareerReadinessStrategy

## 1. Intent & Problem Statement
Different tech career paths prioritize radically different types of evidence:
- **Full-Stack Engineering** heavily weights deployed full-stack code and practical git commits (45% weight on projects).
- **AI/Machine Learning Engineering** demands peer-reviewed papers, empirical benchmarks, and linear algebra/calculus coursework (40% research/models, 30% math/coursework).
- **Cloud Solutions Architecture** values recognized certifications (AWS CCP/SAA, CKA) alongside infrastructure-as-code (35% certs, 35% DevOps pipelines).

A rigid, single formula produces inaccurate student advising. The **Strategy Pattern** defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.

## 2. UML Class Diagram
```
                     +---------------------------------------+
                     |             <<interface>>             |
                     |       ICareerReadinessStrategy        |
                     +---------------------------------------+
                     | + getStrategyName(): string           |
                     | + getWeightings(): StrategyWeightings |
                     | + calculateReadiness(): ScoreResult   |
                     | + identifySkillGaps(): SkillGapItem[] |
                     +---------------------------------------+
                                         ▲
        ┌─────────────────┬──────────────┴────────┬─────────────────┬─────────────────┐
        │                 │                       │                 │                 │
+---------------+ +---------------+       +---------------+ +---------------+ +---------------+
|FullStack      | |AIEngineer     |       |CloudEngineer  | |DataEngineer   | |MobileDeveloper|
|ReadinessStrat | |ReadinessStrat |       |ReadinessStrat | |ReadinessStrat | |ReadinessStrat |
+---------------+ +---------------+       +---------------+ +---------------+ +---------------+
                                         ▲
                                         │ selects
                     +---------------------------------------+
                     |         CareerReadinessContext        |
                     +---------------------------------------+
                     | + static getStrategyForCareer(slug)   |
                     +---------------------------------------+
```

## 3. Five Concrete Strategies
1. **`FullStackReadinessStrategy`**: Projects 45%, Core Competencies 35%, Coursework 20%.
2. **`AIEngineerReadinessStrategy`**: Research/Models 40%, Foundations/Math 30%, Frameworks 30%.
3. **`CloudEngineerReadinessStrategy`**: Certifications 35%, CI/CD Projects 35%, Cloud Theory 30%.
4. **`DataEngineerReadinessStrategy`**: SQL/ETL Pipelines 40%, Database Theory 30%, Distributed Systems 30%.
5. **`MobileDeveloperReadinessStrategy`**: Published Apps/Demos 45%, UI/UX APIs 35%, Mobile OS Coursework 20%.

## 4. Verification & Testing
Validated in `src/scoring/patterns.test.ts`:
- Ensures `CareerReadinessContext` resolves appropriate strategy by slug.
- Verifies distinct weighting applied between FullStack and AI strategies.
- Asserts skill gap recommendations for missing competencies.
