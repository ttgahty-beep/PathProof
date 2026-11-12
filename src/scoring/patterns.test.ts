/**
 * PathProof — Software Design Patterns & Repository Unit & Integration Tests
 * Validates GoF patterns and repository behaviors according to university SCD specification:
 * 1. Singleton Pattern (DatabaseConnectionManager)
 * 2. Factory Pattern (EvidenceFactory & 5 processors)
 * 3. Observer Pattern (VerificationEventSubject & 4 observers)
 * 4. Strategy Pattern (CareerReadinessStrategy & 5 disciplines)
 * 5. Repository Pattern & CRUD (UserRepository, StudentRepository, EvidenceRepository, etc.)
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { DatabaseConnectionManager } from '../patterns/singleton/DatabaseConnectionManager.ts';
import {
  EvidenceFactory,
  ProjectEvidenceProcessor,
  GitHubEvidenceProcessor,
  CourseworkEvidenceProcessor,
  CertificationEvidenceProcessor,
  ResearchEvidenceProcessor,
} from '../patterns/factory/EvidenceFactory.ts';
import {
  VerificationEventSubject,
  ReadinessObserver,
  NotificationObserver,
  ActivityHistoryObserver,
  RoadmapObserver,
  VerificationEvent,
} from '../patterns/observer/EvidenceVerificationEvent.ts';
import {
  CareerReadinessContext,
  FullStackReadinessStrategy,
  AIEngineerReadinessStrategy,
  CloudEngineerReadinessStrategy,
  DataEngineerReadinessStrategy,
  MobileDeveloperReadinessStrategy,
  StudentContext,
  CareerContext,
} from '../patterns/strategy/CareerReadinessStrategy.ts';
import { UserRepository } from '../patterns/repository/UserRepository.ts';
import { EvidenceRepository } from '../patterns/repository/EvidenceRepository.ts';
import { CareerRepository } from '../patterns/repository/CareerRepository.ts';
import { getServiceContainer, ServiceContainer } from '../patterns/di/ServiceContainer.ts';
import { runDatabaseSeed } from '../../scripts/seed_db.ts';

describe('1. Singleton Pattern: DatabaseConnectionManager', () => {
  test('returns the identical instance when requested multiple times', () => {
    const instanceA = DatabaseConnectionManager.getInstance();
    const instanceB = DatabaseConnectionManager.getInstance();
    assert.strictEqual(instanceA, instanceB, 'Singleton instances must refer to the exact same object reference');
  });

  test('holds centralized configuration and provides ping health status', async () => {
    const instance = DatabaseConnectionManager.getInstance();
    const config = instance.getConfig();
    assert.ok(config.host, 'Config host should be present');
    assert.strictEqual(typeof config.port, 'number', 'Port must be a number');

    const ping = await instance.ping();
    assert.strictEqual(typeof ping.ok, 'boolean', 'Ping response must report boolean status');
    assert.ok(ping.message, 'Ping response must include descriptive message');
  });
});

describe('2. Factory Pattern: EvidenceFactory', () => {
  test('instantiates correct processor subclasses for each evidence category', () => {
    const projectProc = EvidenceFactory.getProcessor('PROJECT');
    assert.ok(projectProc instanceof ProjectEvidenceProcessor, 'PROJECT must yield ProjectEvidenceProcessor');

    const githubProc = EvidenceFactory.getProcessor('GITHUB');
    assert.ok(githubProc instanceof GitHubEvidenceProcessor, 'GITHUB must yield GitHubEvidenceProcessor');

    const courseProc = EvidenceFactory.getProcessor('COURSEWORK');
    assert.ok(courseProc instanceof CourseworkEvidenceProcessor, 'COURSEWORK must yield CourseworkEvidenceProcessor');

    const certProc = EvidenceFactory.getProcessor('CERTIFICATION');
    assert.ok(certProc instanceof CertificationEvidenceProcessor, 'CERTIFICATION must yield CertificationEvidenceProcessor');

    const researchProc = EvidenceFactory.getProcessor('RESEARCH');
    assert.ok(researchProc instanceof ResearchEvidenceProcessor, 'RESEARCH must yield ResearchEvidenceProcessor');
  });

  test('throws descriptive error on unsupported evidence type', () => {
    assert.throws(
      () => EvidenceFactory.getProcessor('INVALID_TYPE' as any),
      /Unsupported evidence type/,
      'Should throw error on invalid type'
    );
  });

  test('validates inputs correctly across processors', () => {
    const githubProc = new GitHubEvidenceProcessor();
    const invalidGh = githubProc.validate({
      title: 'Bad repo',
      description: 'short',
      evidence_type: 'GITHUB',
      external_url: 'https://example.com/not-github',
    });
    assert.strictEqual(invalidGh.isValid, false, 'Invalid github URL must fail validation');

    const validGh = githubProc.validate({
      title: 'Valid repo',
      description: 'Full stack production application repository with tests',
      evidence_type: 'GITHUB',
      external_url: 'https://github.com/nust/pathproof',
    });
    assert.strictEqual(validGh.isValid, true, 'Proper github URL must pass validation');
  });

  test('calculates type-specific weight and formatted details', () => {
    const processed = EvidenceFactory.process({
      title: 'PathProof AI Intelligence',
      description: 'Production web application with Express backend and TypeScript SPA',
      evidence_type: 'PROJECT',
      external_url: 'https://pathproof.example.com',
    });

    assert.strictEqual(processed.evidenceType, 'PROJECT');
    assert.ok(processed.weight >= 0.85, 'Live project should receive high weighting');
    assert.strictEqual(processed.summaryBadge, 'Production Project');
  });
});

describe('3. Observer Pattern: EvidenceVerificationEvent', () => {
  test('notifies all registered observers upon valid verification event', async () => {
    const subject = new VerificationEventSubject();
    const readinessObs = new ReadinessObserver();
    const notifObs = new NotificationObserver();
    const activityObs = new ActivityHistoryObserver();
    const roadmapObs = new RoadmapObserver();

    // Clear and attach custom test observers
    subject.getObservers().forEach((o) => subject.removeObserver(o));
    subject.registerObserver(readinessObs);
    subject.registerObserver(notifObs);
    subject.registerObserver(activityObs);
    subject.registerObserver(roadmapObs);

    const event: VerificationEvent = {
      verificationId: 101,
      evidenceId: 42,
      studentUserId: 1,
      reviewerId: 3,
      reviewerName: 'Dr. Shahbaz Akhtar',
      previousStatus: 'PENDING',
      newStatus: 'APPROVED',
      evidenceTitle: 'FYP Software Engineering Artifact',
      feedback: 'Approved with distinction. Exemplary software architecture.',
      timestamp: new Date(),
    };

    const res = await subject.notifyObservers(event);
    assert.strictEqual(res.notifiedCount, 4, 'All 4 observers must receive event dispatch');

    // Verify NotificationObserver received correct message
    const notifications = notifObs.getSentNotifications();
    assert.strictEqual(notifications.length, 1);
    assert.ok(notifications[0].title.includes('Approved'));
    assert.ok(notifications[0].message.includes('Dr. Shahbaz Akhtar'));

    // Verify ActivityHistoryObserver recorded audit
    const activities = activityObs.getActivityLog();
    assert.strictEqual(activities.length, 1);
    assert.strictEqual(activities[0].action, 'EVIDENCE_VERIFICATION_STATUS_CHANGED');

    // Verify RoadmapObserver marked milestone complete
    const milestones = roadmapObs.getMilestoneUpdates();
    assert.strictEqual(milestones[0].milestoneStatus, 'COMPLETED_VIA_VERIFIED_EVIDENCE');
  });

  test('guards against unapproved or malformed event broadcast', async () => {
    const subject = new VerificationEventSubject();
    await assert.rejects(
      async () => {
        await subject.notifyObservers({
          verificationId: 1,
          evidenceId: 0, // Invalid evidenceId
          studentUserId: 1,
          reviewerId: 2,
          reviewerName: 'Reviewer',
          previousStatus: 'PENDING',
          newStatus: 'APPROVED',
          evidenceTitle: 'Test',
          feedback: '',
          timestamp: new Date(),
        });
      },
      /Invalid verification event/,
      'Must reject event missing valid evidence ID'
    );
  });
});

describe('4. Strategy Pattern: CareerReadinessStrategy', () => {
  const dummyStudent: StudentContext = {
    userId: 1,
    fullName: 'Hamza Tariq',
    skills: [
      { competencyId: 1, competencyName: 'React & TypeScript', proficiencyLevel: 3, verifiedStatus: 'FACULTY_VERIFIED' },
      { competencyId: 2, competencyName: 'Node.js & Express', proficiencyLevel: 3, verifiedStatus: 'FACULTY_VERIFIED' },
      { competencyId: 3, competencyName: 'Relational SQL & Query Optimization', proficiencyLevel: 3, verifiedStatus: 'FACULTY_VERIFIED' },
      { competencyId: 5, competencyName: 'PyTorch & Deep Learning', proficiencyLevel: 1, verifiedStatus: 'SELF_REPORTED' },
    ],
    evidence: [
      { evidenceType: 'PROJECT', title: 'PathProof Platform', verificationStatus: 'APPROVED', weight: 0.9 },
      { evidenceType: 'GITHUB', title: 'Express PR', verificationStatus: 'APPROVED', weight: 0.95 },
    ],
  };

  const dummyFullStackCareer: CareerContext = {
    careerId: 1,
    careerTitle: 'Full-Stack Developer',
    slug: 'full-stack-developer',
    categoryName: 'Software Engineering',
    requirements: [
      { competencyId: 1, competencyName: 'React & TypeScript', targetLevel: 4, importanceWeight: 1.3, requirementType: 'CORE' },
      { competencyId: 2, competencyName: 'Node.js & Express', targetLevel: 4, importanceWeight: 1.25, requirementType: 'CORE' },
      { competencyId: 3, competencyName: 'Relational SQL & Query Optimization', targetLevel: 3, importanceWeight: 1.15, requirementType: 'CORE' },
    ],
  };

  const dummyAICareer: CareerContext = {
    careerId: 2,
    careerTitle: 'AI / Machine Learning Engineer',
    slug: 'ai-machine-learning-engineer',
    categoryName: 'Artificial Intelligence',
    requirements: [
      { competencyId: 5, competencyName: 'PyTorch & Deep Learning', targetLevel: 4, importanceWeight: 1.4, requirementType: 'CORE' },
      { competencyId: 3, competencyName: 'Relational SQL & Query Optimization', targetLevel: 3, importanceWeight: 1.1, requirementType: 'CORE' },
    ],
  };

  test('context selector resolves correct strategy by slug', () => {
    const fsStrat = CareerReadinessContext.getStrategyForCareer('full-stack-developer');
    assert.ok(fsStrat instanceof FullStackReadinessStrategy);

    const aiStrat = CareerReadinessContext.getStrategyForCareer('ai-machine-learning-engineer');
    assert.ok(aiStrat instanceof AIEngineerReadinessStrategy);

    const cloudStrat = CareerReadinessContext.getStrategyForCareer('cloud-solutions-architect');
    assert.ok(cloudStrat instanceof CloudEngineerReadinessStrategy);

    const dataStrat = CareerReadinessContext.getStrategyForCareer('data-engineer');
    assert.ok(dataStrat instanceof DataEngineerReadinessStrategy);

    const mobStrat = CareerReadinessContext.getStrategyForCareer('mobile-application-developer');
    assert.ok(mobStrat instanceof MobileDeveloperReadinessStrategy);
  });

  test('applies differentiated weights for FullStack vs AI strategies', () => {
    const fsStrat = new FullStackReadinessStrategy();
    const fsScore = fsStrat.calculateReadiness(dummyStudent, dummyFullStackCareer);
    assert.strictEqual(fsScore.weightings.practicalProjectsWeight, 0.45);
    assert.ok(fsScore.overallScore >= 70, 'Student with verified projects should score well in Full Stack');

    const aiStrat = new AIEngineerReadinessStrategy();
    const aiScore = aiStrat.calculateReadiness(dummyStudent, dummyAICareer);
    assert.strictEqual(aiScore.weightings.practicalProjectsWeight, 0.40);
    // AI score should reflect the gap in PyTorch
    assert.ok(aiScore.breakdown.competenciesScore < fsScore.breakdown.competenciesScore);
  });

  test('identifies specific skill gaps and targeted recommendations', () => {
    const aiStrat = new AIEngineerReadinessStrategy();
    const gaps = aiStrat.identifySkillGaps(dummyStudent, dummyAICareer);
    const pytorchGap = gaps.find((g) => g.competencyId === 5);
    assert.ok(pytorchGap);
    assert.strictEqual(pytorchGap.gap, 3); // target 4 - current 1 = 3
    assert.ok(pytorchGap.recommendation.includes('PyTorch'));
  });
});

describe('5. Repository Pattern & Dependency Injection', () => {
  beforeEach(async () => {
    await runDatabaseSeed();
  });

  test('UserRepository performs CRUD and password verification', async () => {
    const container = getServiceContainer();
    const userRepo = container.userRepository;

    const user = await userRepo.findById(1);
    assert.ok(user, 'User #1 (Hamza Tariq) must exist in seed');
    assert.strictEqual(user.email, 'hamza.tariq@seecs.edu.pk');

    const isValidPw = await userRepo.verifyPassword(user, 'Password123!');
    assert.strictEqual(isValidPw, true, 'Password verification must succeed with correct plain password');

    const isInvalidPw = await userRepo.verifyPassword(user, 'WrongPassword');
    assert.strictEqual(isInvalidPw, false, 'Password verification must fail on wrong password');
  });

  test('EvidenceRepository enforces student ownership on updates and deletions', async () => {
    const container = getServiceContainer();
    const evidenceRepo = container.evidenceRepository;

    // Student 1 owns evidence 1
    const items = await evidenceRepo.findByUserId(1);
    assert.ok(items.length > 0);

    // Another student (e.g. userId 2) attempting to update evidence 1 must fail
    await assert.rejects(
      async () => {
        await evidenceRepo.update(1, 2, { title: 'Unauthorized Modification' });
      },
      /Security Violation/,
      'Cannot update evidence owned by another student'
    );

    // Student 1 can update their own evidence
    const updateSuccess = await evidenceRepo.update(1, 1, { title: 'Updated Title by Owner' });
    assert.strictEqual(updateSuccess, true);
  });

  test('ServiceContainer coordinates cross-pattern verification workflow', async () => {
    const container = getServiceContainer();

    const result = await container.verificationService.reviewEvidence({
      evidenceId: 1,
      reviewerUserId: 3,
      reviewerName: 'Dr. Shahbaz Akhtar',
      newStatus: 'APPROVED',
      feedback: 'Verification workflow integration test passed.',
    });

    assert.ok(result.verificationRecord);
    assert.strictEqual(result.verificationRecord.new_status, 'APPROVED');
    assert.strictEqual(result.observersNotified, 4, 'VerificationService must notify all 4 observers via VerificationEventSubject');
  });
});
