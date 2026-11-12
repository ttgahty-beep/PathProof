/**
 * PathProof — Evidence Processing Factory (Factory Pattern)
 * Provides dedicated processors for 5 evidence categories:
 * - ProjectEvidenceProcessor
 * - GitHubEvidenceProcessor
 * - CourseworkEvidenceProcessor
 * - CertificationEvidenceProcessor
 * - ResearchEvidenceProcessor
 */

export type EvidenceType = 'PROJECT' | 'GITHUB' | 'COURSEWORK' | 'CERTIFICATION' | 'RESEARCH';

export interface EvidenceInput {
  title: string;
  description: string;
  evidence_type: EvidenceType;
  external_url?: string;
  claimed_skills?: { competency_id: number; claimed_level: number }[];
  metadata?: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ProcessedEvidence {
  evidenceType: EvidenceType;
  title: string;
  description: string;
  weight: number; // 0.0 to 1.0 weight multiplier for readiness scoring
  sanitizedUrl?: string;
  summaryBadge: string;
  verificationRecommendations: string[];
  metadata: Record<string, any>;
}

/**
 * Common Evidence Processor Interface (Product Interface)
 */
export interface IEvidenceProcessor {
  validate(item: EvidenceInput): ValidationResult;
  calculateWeight(item: EvidenceInput): number;
  formatDetails(item: EvidenceInput): string;
  processEvidence(item: EvidenceInput): ProcessedEvidence;
}

/**
 * 1. Project Evidence Processor
 * Evaluates practical software engineering deliverables, complexity, and live demos.
 */
export class ProjectEvidenceProcessor implements IEvidenceProcessor {
  validate(item: EvidenceInput): ValidationResult {
    const errors: string[] = [];
    if (!item.title || item.title.trim().length < 5) {
      errors.push('Project title must be at least 5 characters long.');
    }
    if (!item.description || item.description.trim().length < 20) {
      errors.push('Project description must clearly detail architecture and technologies (min 20 characters).');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  calculateWeight(item: EvidenceInput): number {
    let weight = 0.85; // High practical weighting
    if (item.external_url && (item.external_url.includes('http://') || item.external_url.includes('https://'))) {
      weight += 0.1; // Bonus for live demo or deploy link
    }
    const wordCount = (item.description || '').split(/\s+/).length;
    if (wordCount > 50) {
      weight += 0.05;
    }
    return Math.min(weight, 1.0);
  }

  formatDetails(item: EvidenceInput): string {
    return `[Project Deliverable] "${item.title}" — Live URL: ${item.external_url || 'N/A'}`;
  }

  processEvidence(item: EvidenceInput): ProcessedEvidence {
    const val = this.validate(item);
    if (!val.isValid) {
      throw new Error(`Invalid Project Evidence: ${val.errors.join('; ')}`);
    }
    const weight = this.calculateWeight(item);
    return {
      evidenceType: 'PROJECT',
      title: item.title.trim(),
      description: item.description.trim(),
      weight,
      sanitizedUrl: item.external_url?.trim(),
      summaryBadge: 'Production Project',
      verificationRecommendations: [
        'Review code organization and architecture',
        'Verify production deployment or live demo functionality',
        'Inspect commit history and author attribution',
      ],
      metadata: {
        category: 'Practical Engineering',
        complexityRating: weight >= 0.9 ? 'High' : 'Moderate',
      },
    };
  }
}

/**
 * 2. GitHub Evidence Processor
 * Evaluates source code repository, commit activity, branch management, and open-source contributions.
 */
export class GitHubEvidenceProcessor implements IEvidenceProcessor {
  validate(item: EvidenceInput): ValidationResult {
    const errors: string[] = [];
    if (!item.external_url || !item.external_url.toLowerCase().includes('github.com/')) {
      errors.push('GitHub evidence requires a valid GitHub repository URL (e.g. https://github.com/user/repo).');
    }
    if (!item.description || item.description.trim().length < 15) {
      errors.push('Provide a description of your repository code contribution (min 15 characters).');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  calculateWeight(item: EvidenceInput): number {
    let weight = 0.9; // Direct code proof has highest baseline
    if (item.external_url?.includes('/pull/') || item.description.toLowerCase().includes('open-source')) {
      weight += 0.1; // Open source PR bonus
    }
    return Math.min(weight, 1.0);
  }

  formatDetails(item: EvidenceInput): string {
    return `[GitHub Repo] ${item.external_url} (${item.title})`;
  }

  processEvidence(item: EvidenceInput): ProcessedEvidence {
    const val = this.validate(item);
    if (!val.isValid) {
      throw new Error(`Invalid GitHub Evidence: ${val.errors.join('; ')}`);
    }
    const weight = this.calculateWeight(item);
    return {
      evidenceType: 'GITHUB',
      title: item.title.trim(),
      description: item.description.trim(),
      weight,
      sanitizedUrl: item.external_url?.trim(),
      summaryBadge: 'GitHub Source Code',
      verificationRecommendations: [
        'Inspect README clarity and documentation',
        'Verify Git commit frequency and commit message quality',
        'Check test coverage and continuous integration configuration',
      ],
      metadata: {
        category: 'Source Code Artifact',
        repoUrl: item.external_url?.trim(),
      },
    };
  }
}

/**
 * 3. Coursework Evidence Processor
 * Evaluates academic coursework aligned with HEC Pakistan CS/SE curriculum and university credits.
 */
export class CourseworkEvidenceProcessor implements IEvidenceProcessor {
  validate(item: EvidenceInput): ValidationResult {
    const errors: string[] = [];
    if (!item.title || item.title.trim().length < 4) {
      errors.push('Course title / code is required (e.g. CS-301 Data Structures).');
    }
    if (!item.description || item.description.trim().length < 10) {
      errors.push('Course description or syllabus topics covered are required.');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  calculateWeight(item: EvidenceInput): number {
    // Academic coursework gives foundational weight (0.75 - 0.85)
    let weight = 0.75;
    const desc = item.description.toLowerCase();
    if (desc.includes('grade a') || desc.includes('3.7') || desc.includes('4.0') || desc.includes('cgpa')) {
      weight += 0.1;
    }
    return Math.min(weight, 0.85);
  }

  formatDetails(item: EvidenceInput): string {
    return `[Academic Coursework] ${item.title} — Verified via University Curriculum`;
  }

  processEvidence(item: EvidenceInput): ProcessedEvidence {
    const val = this.validate(item);
    if (!val.isValid) {
      throw new Error(`Invalid Coursework Evidence: ${val.errors.join('; ')}`);
    }
    const weight = this.calculateWeight(item);
    return {
      evidenceType: 'COURSEWORK',
      title: item.title.trim(),
      description: item.description.trim(),
      weight,
      summaryBadge: 'HEC University Coursework',
      verificationRecommendations: [
        'Confirm course enrollment and completion status on official transcript',
        'Verify prerequisite course grade and credit hours',
      ],
      metadata: {
        category: 'Academic Credential',
        hecAligned: true,
      },
    };
  }
}

/**
 * 4. Certification Evidence Processor
 * Evaluates industry certifications (AWS, GCP, CMMI, Oracle, DeepLearning.AI).
 */
export class CertificationEvidenceProcessor implements IEvidenceProcessor {
  validate(item: EvidenceInput): ValidationResult {
    const errors: string[] = [];
    if (!item.title || item.title.trim().length < 5) {
      errors.push('Certification credential name is required.');
    }
    if (!item.external_url && !item.description.toLowerCase().includes('credential id')) {
      errors.push('Certification requires verification URL or credential ID in description.');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  calculateWeight(item: EvidenceInput): number {
    let weight = 0.8;
    const title = item.title.toLowerCase();
    if (title.includes('aws') || title.includes('google cloud') || title.includes('azure') || title.includes('cka')) {
      weight += 0.15; // Recognized cloud certifications have high weight
    }
    return Math.min(weight, 0.95);
  }

  formatDetails(item: EvidenceInput): string {
    return `[Industry Certificate] ${item.title} — Verified ID/URL: ${item.external_url || 'Provided in details'}`;
  }

  processEvidence(item: EvidenceInput): ProcessedEvidence {
    const val = this.validate(item);
    if (!val.isValid) {
      throw new Error(`Invalid Certification Evidence: ${val.errors.join('; ')}`);
    }
    const weight = this.calculateWeight(item);
    return {
      evidenceType: 'CERTIFICATION',
      title: item.title.trim(),
      description: item.description.trim(),
      weight,
      sanitizedUrl: item.external_url?.trim(),
      summaryBadge: 'Industry Certification',
      verificationRecommendations: [
        'Validate credential ID with issuing authority portal (Credly, AWS, Google, etc.)',
        'Verify expiration date if applicable',
      ],
      metadata: {
        category: 'Professional Certification',
        verifiedAuthority: true,
      },
    };
  }
}

/**
 * 5. Research Evidence Processor
 * Evaluates academic papers, IEEE/ACM conference presentations, and technical reports.
 */
export class ResearchEvidenceProcessor implements IEvidenceProcessor {
  validate(item: EvidenceInput): ValidationResult {
    const errors: string[] = [];
    if (!item.title || item.title.trim().length < 8) {
      errors.push('Research publication or technical report title must be at least 8 characters.');
    }
    if (!item.description || item.description.trim().length < 25) {
      errors.push('Research abstract and methodology overview required (min 25 characters).');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  calculateWeight(item: EvidenceInput): number {
    let weight = 0.9;
    const desc = item.description.toLowerCase();
    if (desc.includes('ieee') || desc.includes('acm') || desc.includes('springer') || desc.includes('journal')) {
      weight = 0.95; // Indexed conference or journal
    }
    return weight;
  }

  formatDetails(item: EvidenceInput): string {
    return `[Research Publication] "${item.title}" — DOI/URL: ${item.external_url || 'Under Review'}`;
  }

  processEvidence(item: EvidenceInput): ProcessedEvidence {
    const val = this.validate(item);
    if (!val.isValid) {
      throw new Error(`Invalid Research Evidence: ${val.errors.join('; ')}`);
    }
    const weight = this.calculateWeight(item);
    return {
      evidenceType: 'RESEARCH',
      title: item.title.trim(),
      description: item.description.trim(),
      weight,
      sanitizedUrl: item.external_url?.trim(),
      summaryBadge: 'Academic Research',
      verificationRecommendations: [
        'Check publication indexing status (IEEE Xplore, ACM Digital Library, Scopus)',
        'Confirm student authorship order and faculty advisor endorsement',
      ],
      metadata: {
        category: 'Scholarly Research',
        isPeerReviewed: item.description.toLowerCase().includes('peer-reviewed'),
      },
    };
  }
}

/**
 * Evidence Factory
 * Creator class that instantiates specialized processors based on EvidenceType.
 */
export class EvidenceFactory {
  private static processors: Map<EvidenceType, IEvidenceProcessor> = new Map([
    ['PROJECT', new ProjectEvidenceProcessor()],
    ['GITHUB', new GitHubEvidenceProcessor()],
    ['COURSEWORK', new CourseworkEvidenceProcessor()],
    ['CERTIFICATION', new CertificationEvidenceProcessor()],
    ['RESEARCH', new ResearchEvidenceProcessor()],
  ]);

  /**
   * Factory Method: Returns the concrete processor matching the given type.
   */
  public static getProcessor(type: EvidenceType): IEvidenceProcessor {
    const processor = this.processors.get(type);
    if (!processor) {
      throw new Error(`[EvidenceFactory] Unsupported evidence type: "${type}". Supported types are: PROJECT, GITHUB, COURSEWORK, CERTIFICATION, RESEARCH.`);
    }
    return processor;
  }

  /**
   * Helper to process an evidence item directly using its type-specific processor
   */
  public static process(item: EvidenceInput): ProcessedEvidence {
    const processor = this.getProcessor(item.evidence_type);
    return processor.processEvidence(item);
  }
}
