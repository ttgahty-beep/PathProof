/**
 * PathProof — Dependency Injection Container (DI Pattern)
 * Centralizes instantiation and injection of Repositories, Strategies, Observers, and Services.
 * Decouples controllers/routes from concrete class constructors.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';
import { UserRepository, IUserRepository } from '../repository/UserRepository.ts';
import { StudentRepository, IStudentRepository } from '../repository/StudentRepository.ts';
import { CareerRepository, ICareerRepository } from '../repository/CareerRepository.ts';
import { CompetencyRepository, ICompetencyRepository } from '../repository/CompetencyRepository.ts';
import { EvidenceRepository, IEvidenceRepository } from '../repository/EvidenceRepository.ts';
import { VerificationRepository, IVerificationRepository } from '../repository/VerificationRepository.ts';
import { RoadmapRepository, IRoadmapRepository } from '../repository/RoadmapRepository.ts';
import { NotificationRepository, INotificationRepository } from '../repository/NotificationRepository.ts';
import { EvidenceFactory, EvidenceInput, ProcessedEvidence } from '../factory/EvidenceFactory.ts';
import { VerificationEventSubject, VerificationEvent, verificationEventSubject } from '../observer/EvidenceVerificationEvent.ts';
import { CareerReadinessContext, StudentContext, CareerContext, ReadinessScoreResult, SkillGapItem } from '../strategy/CareerReadinessStrategy.ts';

// ============================================================================
// Service Layer Interfaces & Implementations
// ============================================================================

export class PatternAuthenticationService {
  constructor(private userRepo: IUserRepository, private studentRepo: IStudentRepository) {}

  async register(fullName: string, email: string, passwordPlain: string, role: 'STUDENT' | 'ADMIN' | 'REVIEWER' = 'STUDENT') {
    const user = await this.userRepo.create({
      email,
      passwordPlain,
      full_name: fullName,
      role,
    });

    if (role === 'STUDENT') {
      await this.studentRepo.create({
        user_id: user.user_id,
        university_name: 'NUST Islamabad',
        degree_program: 'BS Software Engineering',
      });
    }

    return user;
  }

  async authenticate(email: string, passwordPlain: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    if (user.account_status === 'DISABLED') {
      throw new Error('This account has been disabled.');
    }
    const isValid = await this.userRepo.verifyPassword(user, passwordPlain);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }
    return user;
  }

  async getUserById(userId: number) {
    return this.userRepo.findById(userId);
  }
}

export class PatternEvidenceService {
  constructor(
    private evidenceRepo: IEvidenceRepository,
    private notifRepo: INotificationRepository
  ) {}

  async submitEvidence(userId: number, input: EvidenceInput) {
    // 1. Process and validate evidence via Factory Pattern
    const processed = EvidenceFactory.process(input);

    // 2. Persist in MySQL via EvidenceRepository
    const created = await this.evidenceRepo.create({
      user_id: userId,
      title: processed.title,
      description: processed.description,
      evidence_type: processed.evidenceType,
      external_url: processed.sanitizedUrl,
      claimed_skills: input.claimed_skills,
    });

    // 3. Record audit activity
    await this.notifRepo.recordActivity({
      user_id: userId,
      action_type: 'EVIDENCE_SUBMITTED',
      entity_type: 'evidence_items',
      entity_id: created.evidence_id,
      description: `Student submitted new ${processed.summaryBadge}: "${processed.title}"`,
      metadata: { weight: processed.weight, recommendations: processed.verificationRecommendations },
    });

    return {
      evidence: created,
      processedDetails: processed,
    };
  }

  async getStudentEvidence(userId: number) {
    return this.evidenceRepo.findByUserId(userId);
  }

  async deleteEvidence(evidenceId: number, userId: number) {
    return this.evidenceRepo.delete(evidenceId, userId);
  }
}

export class PatternVerificationService {
  constructor(
    private verificationRepo: IVerificationRepository,
    private evidenceRepo: IEvidenceRepository,
    private notifRepo: INotificationRepository,
    private eventSubject: VerificationEventSubject = verificationEventSubject
  ) {}

  async reviewEvidence(params: {
    evidenceId: number;
    reviewerUserId: number;
    reviewerName: string;
    newStatus: 'APPROVED' | 'REJECTED' | 'NEEDS_WORK';
    feedback: string;
  }) {
    const evidence = await this.evidenceRepo.findById(params.evidenceId);
    if (!evidence) {
      throw new Error(`Evidence item #${params.evidenceId} does not exist.`);
    }

    let reviewer = await this.verificationRepo.findReviewerByUserId(params.reviewerUserId);
    if (!reviewer) {
      // Auto-provision reviewer entity if faculty
      reviewer = await this.verificationRepo.createReviewer({
        user_id: params.reviewerUserId,
        title: 'Faculty Assessor',
        department: 'School of Electrical Engineering & Computer Science (SEECS)',
      });
    }

    const previousStatus = evidence.verification_status;

    // 1. Update evidence item status in DB
    await this.evidenceRepo.updateVerificationStatus(params.evidenceId, params.newStatus);

    // 2. Insert verification audit record
    const record = await this.verificationRepo.recordVerification({
      evidence_id: params.evidenceId,
      reviewer_id: reviewer.reviewer_id,
      previous_status: previousStatus,
      new_status: params.newStatus,
      feedback: params.feedback,
    });

    // 3. Dispatch to Observer Pattern Subject!
    // Broadcasts to ReadinessObserver, NotificationObserver, ActivityHistoryObserver, RoadmapObserver
    const event: VerificationEvent = {
      verificationId: record.verification_id,
      evidenceId: params.evidenceId,
      studentUserId: evidence.user_id,
      reviewerId: reviewer.reviewer_id,
      reviewerName: params.reviewerName,
      previousStatus,
      newStatus: params.newStatus,
      evidenceTitle: evidence.title,
      feedback: params.feedback,
      timestamp: new Date(),
    };

    const dispatchResult = await this.eventSubject.notifyObservers(event);

    return {
      verificationRecord: record,
      observersNotified: dispatchResult.notifiedCount,
    };
  }

  async getVerificationHistory(evidenceId: number) {
    return this.verificationRepo.getHistoryForEvidence(evidenceId);
  }
}

export class PatternReadinessService {
  constructor(
    private careerRepo: ICareerRepository,
    private compRepo: ICompetencyRepository,
    private evidenceRepo: IEvidenceRepository
  ) {}

  async evaluateReadinessForCareer(userId: number, careerSlug: string): Promise<{
    readiness: ReadinessScoreResult;
    skillGaps: SkillGapItem[];
  }> {
    const career = await this.careerRepo.findBySlug(careerSlug);
    if (!career) {
      throw new Error(`Career path with slug "${careerSlug}" not found.`);
    }

    const assessments = await this.compRepo.getStudentAssessments(userId);
    const evidenceList = await this.evidenceRepo.findByUserId(userId);

    const studentCtx: StudentContext = {
      userId,
      fullName: 'Student Assessee',
      skills: assessments.map((a) => ({
        competencyId: a.competency_id,
        competencyName: a.competency_name,
        proficiencyLevel: a.proficiency_level,
        verifiedStatus: a.verified_status,
      })),
      evidence: evidenceList.map((e) => ({
        evidenceType: e.evidence_type,
        title: e.title,
        verificationStatus: e.verification_status,
        weight: 0.85,
      })),
    };

    const careerCtx: CareerContext = {
      careerId: career.career_id,
      careerTitle: career.career_title,
      slug: career.slug,
      categoryName: career.category_name,
      requirements: career.competencies.map((c) => ({
        competencyId: c.competency_id,
        competencyName: c.name,
        targetLevel: c.target_level,
        importanceWeight: Number(c.importance_weight) || 1.0,
        requirementType: c.requirement_type,
      })),
    };

    // Strategy Pattern: Dynamically select algorithm
    const strategy = CareerReadinessContext.getStrategyForCareer(career.slug);
    const readiness = strategy.calculateReadiness(studentCtx, careerCtx);
    const skillGaps = strategy.identifySkillGaps(studentCtx, careerCtx);

    return {
      readiness,
      skillGaps,
    };
  }
}

export class PatternRoadmapService {
  constructor(private roadmapRepo: IRoadmapRepository) {}

  async getStudentRoadmap(userId: number, careerId: number) {
    return this.roadmapRepo.findByUserIdAndCareer(userId, careerId);
  }

  async addRoadmapItem(item: {
    user_id: number;
    career_id: number;
    title: string;
    description?: string;
    target_week: number;
    estimated_hours?: number;
    deliverable?: string;
  }) {
    return this.roadmapRepo.create(item);
  }

  async toggleMilestone(itemId: number, userId: number, isCompleted: boolean) {
    return this.roadmapRepo.markCompleted(itemId, userId, isCompleted);
  }
}

export class PatternNotificationService {
  constructor(private notifRepo: INotificationRepository) {}

  async getNotifications(userId: number) {
    return this.notifRepo.getUserNotifications(userId);
  }

  async markAsRead(notificationId: number, userId: number) {
    return this.notifRepo.markAsRead(notificationId, userId);
  }

  async getActivityFeed(userId: number) {
    return this.notifRepo.getUserActivity(userId);
  }
}

/**
 * Dependency Injection Container
 * Initializes and wires singleton repositories and application services.
 */
export class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  // Repositories
  public readonly userRepository: IUserRepository;
  public readonly studentRepository: IStudentRepository;
  public readonly careerRepository: ICareerRepository;
  public readonly competencyRepository: ICompetencyRepository;
  public readonly evidenceRepository: IEvidenceRepository;
  public readonly verificationRepository: IVerificationRepository;
  public readonly roadmapRepository: IRoadmapRepository;
  public readonly notificationRepository: INotificationRepository;

  // Domain Services
  public readonly authService: PatternAuthenticationService;
  public readonly evidenceService: PatternEvidenceService;
  public readonly verificationService: PatternVerificationService;
  public readonly readinessService: PatternReadinessService;
  public readonly roadmapService: PatternRoadmapService;
  public readonly notificationService: PatternNotificationService;

  private constructor(dbManager?: DatabaseConnectionManager) {
    const db = dbManager || DatabaseConnectionManager.getInstance();

    // 1. Initialize Repositories
    this.userRepository = new UserRepository(db);
    this.studentRepository = new StudentRepository(db);
    this.careerRepository = new CareerRepository(db);
    this.competencyRepository = new CompetencyRepository(db);
    this.evidenceRepository = new EvidenceRepository(db);
    this.verificationRepository = new VerificationRepository(db);
    this.roadmapRepository = new RoadmapRepository(db);
    this.notificationRepository = new NotificationRepository(db);

    // 2. Inject Repositories into Services
    this.authService = new PatternAuthenticationService(this.userRepository, this.studentRepository);
    this.evidenceService = new PatternEvidenceService(this.evidenceRepository, this.notificationRepository);
    this.verificationService = new PatternVerificationService(
      this.verificationRepository,
      this.evidenceRepository,
      this.notificationRepository,
      verificationEventSubject
    );
    this.readinessService = new PatternReadinessService(
      this.careerRepository,
      this.competencyRepository,
      this.evidenceRepository
    );
    this.roadmapService = new PatternRoadmapService(this.roadmapRepository);
    this.notificationService = new PatternNotificationService(this.notificationRepository);
  }

  public static getInstance(dbManager?: DatabaseConnectionManager): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer(dbManager);
    }
    return ServiceContainer.instance;
  }

  public static resetInstance(): void {
    ServiceContainer.instance = null;
  }
}

export const getServiceContainer = (): ServiceContainer => ServiceContainer.getInstance();
