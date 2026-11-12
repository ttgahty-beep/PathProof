/**
 * PathProof — Career Readiness Calculation (Strategy Pattern)
 * Provides distinct algorithms and weighting rules for different career disciplines:
 * 1. FullStackReadinessStrategy
 * 2. AIEngineerReadinessStrategy
 * 3. CloudEngineerReadinessStrategy
 * 4. DataEngineerReadinessStrategy
 * 5. MobileDeveloperReadinessStrategy
 */

export interface StudentSkillAssessment {
  competencyId: number;
  competencyName: string;
  proficiencyLevel: number; // 1-4
  verifiedStatus: string;
}

export interface StudentEvidenceSummary {
  evidenceType: string;
  title: string;
  verificationStatus: string;
  weight: number;
}

export interface StudentContext {
  userId: number;
  fullName: string;
  skills: StudentSkillAssessment[];
  evidence: StudentEvidenceSummary[];
  courseworkGrades?: Record<string, string>;
  certifications?: string[];
}

export interface CareerRequirement {
  competencyId: number;
  competencyName: string;
  targetLevel: number; // 1-4
  importanceWeight: number; // 0.0 - 2.0
  requirementType: 'CORE' | 'ELECTIVE';
}

export interface CareerContext {
  careerId: number;
  careerTitle: string;
  slug: string;
  categoryName: string;
  requirements: CareerRequirement[];
}

export interface SkillGapItem {
  competencyId: number;
  competencyName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  requirementType: 'CORE' | 'ELECTIVE';
  recommendation: string;
}

export interface StrategyWeightings {
  practicalProjectsWeight: number;
  competenciesWeight: number;
  courseworkOrCertificationsWeight: number;
}

export interface ReadinessScoreResult {
  strategyName: string;
  careerTitle: string;
  overallScore: number; // 0 - 100
  breakdown: {
    projectsScore: number;
    competenciesScore: number;
    foundationalScore: number;
  };
  weightings: StrategyWeightings;
  readinessBand: 'READY' | 'COMPETITIVE' | 'DEVELOPING' | 'EXPLORING';
  summaryInsight: string;
}

/**
 * Strategy Interface (Strategy Pattern)
 */
export interface ICareerReadinessStrategy {
  getStrategyName(): string;
  getWeightings(): StrategyWeightings;
  calculateReadiness(student: StudentContext, career: CareerContext): ReadinessScoreResult;
  identifySkillGaps(student: StudentContext, career: CareerContext): SkillGapItem[];
}

function matchesCompetency(s: StudentSkillAssessment, req: CareerRequirement): boolean {
  if (s.competencyId === req.competencyId) return true;
  if (s.competencyName && req.competencyName) {
    return s.competencyName.toLowerCase().trim() === req.competencyName.toLowerCase().trim();
  }
  return false;
}

/**
 * 1. Full Stack Developer Readiness Strategy
 * Prioritizes practical project evidence (45%), core competencies (35%), and academic coursework (20%).
 */
export class FullStackReadinessStrategy implements ICareerReadinessStrategy {
  getStrategyName(): string {
    return 'FullStackReadinessStrategy';
  }

  getWeightings(): StrategyWeightings {
    return {
      practicalProjectsWeight: 0.45,
      competenciesWeight: 0.35,
      courseworkOrCertificationsWeight: 0.20,
    };
  }

  identifySkillGaps(student: StudentContext, career: CareerContext): SkillGapItem[] {
    const gaps: SkillGapItem[] = [];
    for (const req of career.requirements) {
      const studentSkill = student.skills.find((s) => matchesCompetency(s, req));
      const currentLevel = studentSkill ? studentSkill.proficiencyLevel : 0;
      const gap = Math.max(0, req.targetLevel - currentLevel);

      let recommendation = `Acquire foundational knowledge in ${req.competencyName}.`;
      if (gap === 1) {
        recommendation = `Build a full-stack demo showcasing ${req.competencyName} integration with REST/GraphQL.`;
      } else if (gap >= 2) {
        recommendation = `Follow intensive roadmap module and build production-grade code for ${req.competencyName}.`;
      }

      gaps.push({
        competencyId: req.competencyId,
        competencyName: req.competencyName,
        currentLevel,
        targetLevel: req.targetLevel,
        gap,
        requirementType: req.requirementType,
        recommendation,
      });
    }
    return gaps;
  }

  calculateReadiness(student: StudentContext, career: CareerContext): ReadinessScoreResult {
    const weights = this.getWeightings();

    // 1. Projects Score (Full stack values approved GitHub & Project deliverables)
    const validProjects = student.evidence.filter(
      (e) => (e.evidenceType === 'PROJECT' || e.evidenceType === 'GITHUB') && e.verificationStatus === 'APPROVED'
    );
    const projectsScore = Math.min(100, validProjects.length * 35 + (validProjects.length > 0 ? 30 : 0));

    // 2. Competencies Score
    let totalTarget = 0;
    let earned = 0;
    for (const req of career.requirements) {
      totalTarget += req.targetLevel * req.importanceWeight;
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      if (sSkill) {
        earned += Math.min(sSkill.proficiencyLevel, req.targetLevel) * req.importanceWeight;
      }
    }
    const competenciesScore = totalTarget > 0 ? Math.round((earned / totalTarget) * 100) : 50;

    // 3. Coursework / Academic Score
    const courseworkScore = student.evidence.some((e) => e.evidenceType === 'COURSEWORK') ? 85 : 60;

    const overall = Math.round(
      projectsScore * weights.practicalProjectsWeight +
      competenciesScore * weights.competenciesWeight +
      courseworkScore * weights.courseworkOrCertificationsWeight
    );

    let band: 'READY' | 'COMPETITIVE' | 'DEVELOPING' | 'EXPLORING' = 'EXPLORING';
    if (overall >= 80) band = 'READY';
    else if (overall >= 65) band = 'COMPETITIVE';
    else if (overall >= 45) band = 'DEVELOPING';

    return {
      strategyName: this.getStrategyName(),
      careerTitle: career.careerTitle,
      overallScore: overall,
      breakdown: {
        projectsScore,
        competenciesScore,
        foundationalScore: courseworkScore,
      },
      weightings: weights,
      readinessBand: band,
      summaryInsight: `Full-Stack readiness heavily emphasizes demonstrated repositories and multi-tier systems (${validProjects.length} verified projects).`,
    };
  }
}

/**
 * 2. AI / ML Engineer Readiness Strategy
 * Prioritizes research & models (40%), foundational mathematics/algorithms (30%), and ML framework competencies (30%).
 */
export class AIEngineerReadinessStrategy implements ICareerReadinessStrategy {
  getStrategyName(): string {
    return 'AIEngineerReadinessStrategy';
  }

  getWeightings(): StrategyWeightings {
    return {
      practicalProjectsWeight: 0.40,
      competenciesWeight: 0.30,
      courseworkOrCertificationsWeight: 0.30,
    };
  }

  identifySkillGaps(student: StudentContext, career: CareerContext): SkillGapItem[] {
    return career.requirements.map((req) => {
      const studentSkill = student.skills.find((s) => matchesCompetency(s, req));
      const currentLevel = studentSkill ? studentSkill.proficiencyLevel : 0;
      const gap = Math.max(0, req.targetLevel - currentLevel);
      return {
        competencyId: req.competencyId,
        competencyName: req.competencyName,
        currentLevel,
        targetLevel: req.targetLevel,
        gap,
        requirementType: req.requirementType,
        recommendation: gap > 0
          ? `Train a fine-tuned model or publish a benchmark notebook covering ${req.competencyName}.`
          : `Verified mastery in ${req.competencyName}.`,
      };
    });
  }

  calculateReadiness(student: StudentContext, career: CareerContext): ReadinessScoreResult {
    const weights = this.getWeightings();

    const researchAndModels = student.evidence.filter(
      (e) => (e.evidenceType === 'RESEARCH' || e.evidenceType === 'PROJECT') && e.verificationStatus === 'APPROVED'
    );
    const projectsScore = Math.min(100, researchAndModels.length * 40 + (researchAndModels.length > 0 ? 20 : 0));

    let totalTarget = 0;
    let earned = 0;
    for (const req of career.requirements) {
      totalTarget += req.targetLevel * req.importanceWeight;
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      if (sSkill) {
        earned += Math.min(sSkill.proficiencyLevel, req.targetLevel) * req.importanceWeight;
      }
    }
    const competenciesScore = totalTarget > 0 ? Math.round((earned / totalTarget) * 100) : 45;
    const mathAndCourseworkScore = student.evidence.some((e) => e.evidenceType === 'RESEARCH' || e.evidenceType === 'COURSEWORK') ? 88 : 55;

    const overall = Math.round(
      projectsScore * weights.practicalProjectsWeight +
      competenciesScore * weights.competenciesWeight +
      mathAndCourseworkScore * weights.courseworkOrCertificationsWeight
    );

    let band: 'READY' | 'COMPETITIVE' | 'DEVELOPING' | 'EXPLORING' = 'EXPLORING';
    if (overall >= 80) band = 'READY';
    else if (overall >= 65) band = 'COMPETITIVE';
    else if (overall >= 45) band = 'DEVELOPING';

    return {
      strategyName: this.getStrategyName(),
      careerTitle: career.careerTitle,
      overallScore: overall,
      breakdown: {
        projectsScore,
        competenciesScore,
        foundationalScore: mathAndCourseworkScore,
      },
      weightings: weights,
      readinessBand: band,
      summaryInsight: `AI/ML readiness emphasizes reproducible empirical notebooks and mathematical grounding (${researchAndModels.length} models/papers verified).`,
    };
  }
}

/**
 * 3. Cloud Engineer Readiness Strategy
 * Prioritizes recognized cloud certifications (35%), DevOps/Docker infrastructure projects (35%), and networking coursework (30%).
 */
export class CloudEngineerReadinessStrategy implements ICareerReadinessStrategy {
  getStrategyName(): string {
    return 'CloudEngineerReadinessStrategy';
  }

  getWeightings(): StrategyWeightings {
    return {
      practicalProjectsWeight: 0.35,
      competenciesWeight: 0.35,
      courseworkOrCertificationsWeight: 0.30,
    };
  }

  identifySkillGaps(student: StudentContext, career: CareerContext): SkillGapItem[] {
    return career.requirements.map((req) => {
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      const currentLevel = sSkill ? sSkill.proficiencyLevel : 0;
      const gap = Math.max(0, req.targetLevel - currentLevel);
      return {
        competencyId: req.competencyId,
        competencyName: req.competencyName,
        currentLevel,
        targetLevel: req.targetLevel,
        gap,
        requirementType: req.requirementType,
        recommendation: gap > 0 ? `Provision automated Terraform/Docker pipelines for ${req.competencyName}.` : `Cloud target satisfied.`,
      };
    });
  }

  calculateReadiness(student: StudentContext, career: CareerContext): ReadinessScoreResult {
    const weights = this.getWeightings();

    const devopsProjects = student.evidence.filter((e) => (e.evidenceType === 'PROJECT' || e.evidenceType === 'GITHUB') && e.verificationStatus === 'APPROVED');
    const certs = student.evidence.filter((e) => e.evidenceType === 'CERTIFICATION' && e.verificationStatus === 'APPROVED');

    const projectsScore = Math.min(100, devopsProjects.length * 35 + 20);
    const certsScore = Math.min(100, certs.length * 50 + 40);

    let totalTarget = 0;
    let earned = 0;
    for (const req of career.requirements) {
      totalTarget += req.targetLevel * req.importanceWeight;
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      if (sSkill) earned += Math.min(sSkill.proficiencyLevel, req.targetLevel) * req.importanceWeight;
    }
    const competenciesScore = totalTarget > 0 ? Math.round((earned / totalTarget) * 100) : 50;

    const overall = Math.round(
      projectsScore * weights.practicalProjectsWeight +
      competenciesScore * weights.competenciesWeight +
      certsScore * weights.courseworkOrCertificationsWeight
    );

    let band: 'READY' | 'COMPETITIVE' | 'DEVELOPING' | 'EXPLORING' = 'EXPLORING';
    if (overall >= 80) band = 'READY';
    else if (overall >= 65) band = 'COMPETITIVE';
    else if (overall >= 45) band = 'DEVELOPING';

    return {
      strategyName: this.getStrategyName(),
      careerTitle: career.careerTitle,
      overallScore: overall,
      breakdown: {
        projectsScore,
        competenciesScore,
        foundationalScore: certsScore,
      },
      weightings: weights,
      readinessBand: band,
      summaryInsight: `Cloud Engineering evaluates verified infrastructure-as-code and cloud credentials (${certs.length} certs, ${devopsProjects.length} pipelines).`,
    };
  }
}

/**
 * 4. Data Engineer Readiness Strategy
 * Prioritizes SQL/data pipelines (40%), database theory & systems coursework (30%), and ETL/streaming competencies (30%).
 */
export class DataEngineerReadinessStrategy implements ICareerReadinessStrategy {
  getStrategyName(): string {
    return 'DataEngineerReadinessStrategy';
  }

  getWeightings(): StrategyWeightings {
    return {
      practicalProjectsWeight: 0.40,
      competenciesWeight: 0.30,
      courseworkOrCertificationsWeight: 0.30,
    };
  }

  identifySkillGaps(student: StudentContext, career: CareerContext): SkillGapItem[] {
    return career.requirements.map((req) => {
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      const currentLevel = sSkill ? sSkill.proficiencyLevel : 0;
      const gap = Math.max(0, req.targetLevel - currentLevel);
      return {
        competencyId: req.competencyId,
        competencyName: req.competencyName,
        currentLevel,
        targetLevel: req.targetLevel,
        gap,
        requirementType: req.requirementType,
        recommendation: gap > 0 ? `Design a partitioned schema and ETL batch job demonstrating ${req.competencyName}.` : `Core competence met.`,
      };
    });
  }

  calculateReadiness(student: StudentContext, career: CareerContext): ReadinessScoreResult {
    const weights = this.getWeightings();
    const dataProjects = student.evidence.filter((e) => (e.evidenceType === 'PROJECT' || e.evidenceType === 'GITHUB') && e.verificationStatus === 'APPROVED');
    const projectsScore = Math.min(100, dataProjects.length * 35 + 25);

    let totalTarget = 0;
    let earned = 0;
    for (const req of career.requirements) {
      totalTarget += req.targetLevel * req.importanceWeight;
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      if (sSkill) earned += Math.min(sSkill.proficiencyLevel, req.targetLevel) * req.importanceWeight;
    }
    const competenciesScore = totalTarget > 0 ? Math.round((earned / totalTarget) * 100) : 50;
    const courseworkScore = student.evidence.some((e) => e.evidenceType === 'COURSEWORK') ? 85 : 60;

    const overall = Math.round(
      projectsScore * weights.practicalProjectsWeight +
      competenciesScore * weights.competenciesWeight +
      courseworkScore * weights.courseworkOrCertificationsWeight
    );

    let band: 'READY' | 'COMPETITIVE' | 'DEVELOPING' | 'EXPLORING' = 'EXPLORING';
    if (overall >= 80) band = 'READY';
    else if (overall >= 65) band = 'COMPETITIVE';
    else if (overall >= 45) band = 'DEVELOPING';

    return {
      strategyName: this.getStrategyName(),
      careerTitle: career.careerTitle,
      overallScore: overall,
      breakdown: {
        projectsScore,
        competenciesScore,
        foundationalScore: courseworkScore,
      },
      weightings: weights,
      readinessBand: band,
      summaryInsight: `Data Engineering requires high proficiency in data warehouse design and query performance optimization.`,
    };
  }
}

/**
 * 5. Mobile Developer Readiness Strategy
 * Prioritizes published mobile demos/apps (45%), responsive UI/UX & API integration (35%), and mobile architecture coursework (20%).
 */
export class MobileDeveloperReadinessStrategy implements ICareerReadinessStrategy {
  getStrategyName(): string {
    return 'MobileDeveloperReadinessStrategy';
  }

  getWeightings(): StrategyWeightings {
    return {
      practicalProjectsWeight: 0.45,
      competenciesWeight: 0.35,
      courseworkOrCertificationsWeight: 0.20,
    };
  }

  identifySkillGaps(student: StudentContext, career: CareerContext): SkillGapItem[] {
    return career.requirements.map((req) => {
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      const currentLevel = sSkill ? sSkill.proficiencyLevel : 0;
      const gap = Math.max(0, req.targetLevel - currentLevel);
      return {
        competencyId: req.competencyId,
        competencyName: req.competencyName,
        currentLevel,
        targetLevel: req.targetLevel,
        gap,
        requirementType: req.requirementType,
        recommendation: gap > 0 ? `Ship a mobile application release or APK demonstrating ${req.competencyName}.` : `Mobile competence validated.`,
      };
    });
  }

  calculateReadiness(student: StudentContext, career: CareerContext): ReadinessScoreResult {
    const weights = this.getWeightings();
    const appProjects = student.evidence.filter((e) => (e.evidenceType === 'PROJECT' || e.evidenceType === 'GITHUB') && e.verificationStatus === 'APPROVED');
    const projectsScore = Math.min(100, appProjects.length * 40 + 20);

    let totalTarget = 0;
    let earned = 0;
    for (const req of career.requirements) {
      totalTarget += req.targetLevel * req.importanceWeight;
      const sSkill = student.skills.find((s) => matchesCompetency(s, req));
      if (sSkill) earned += Math.min(sSkill.proficiencyLevel, req.targetLevel) * req.importanceWeight;
    }
    const competenciesScore = totalTarget > 0 ? Math.round((earned / totalTarget) * 100) : 50;
    const foundationalScore = student.evidence.some((e) => e.evidenceType === 'COURSEWORK') ? 80 : 60;

    const overall = Math.round(
      projectsScore * weights.practicalProjectsWeight +
      competenciesScore * weights.competenciesWeight +
      foundationalScore * weights.courseworkOrCertificationsWeight
    );

    let band: 'READY' | 'COMPETITIVE' | 'DEVELOPING' | 'EXPLORING' = 'EXPLORING';
    if (overall >= 80) band = 'READY';
    else if (overall >= 65) band = 'COMPETITIVE';
    else if (overall >= 45) band = 'DEVELOPING';

    return {
      strategyName: this.getStrategyName(),
      careerTitle: career.careerTitle,
      overallScore: overall,
      breakdown: {
        projectsScore,
        competenciesScore,
        foundationalScore,
      },
      weightings: weights,
      readinessBand: band,
      summaryInsight: `Mobile Engineering demands practical app store releases and offline-first client architecture.`,
    };
  }
}

/**
 * Strategy Context / Selector
 * Resolves the appropriate strategy based on career slug or category.
 */
export class CareerReadinessContext {
  private static strategies: Map<string, ICareerReadinessStrategy> = new Map([
    ['full-stack-developer', new FullStackReadinessStrategy()],
    ['ai-machine-learning-engineer', new AIEngineerReadinessStrategy()],
    ['ai-engineer', new AIEngineerReadinessStrategy()],
    ['cloud-solutions-architect', new CloudEngineerReadinessStrategy()],
    ['cloud-engineer', new CloudEngineerReadinessStrategy()],
    ['data-engineer', new DataEngineerReadinessStrategy()],
    ['mobile-application-developer', new MobileDeveloperReadinessStrategy()],
  ]);

  public static getStrategyForCareer(slugOrTitle: string): ICareerReadinessStrategy {
    const key = (slugOrTitle || '').toLowerCase().replace(/\s+/g, '-');
    for (const [k, strat] of this.strategies.entries()) {
      if (key.includes(k) || k.includes(key)) {
        return strat;
      }
    }
    // Default fallback to FullStack strategy
    return new FullStackReadinessStrategy();
  }
}
