/**
 * PathProof Phase 1 — REST API Router & Middleware
 * Strictly implements PP-P1-API-001 (REST API Specification).
 */

import { Router, Request, Response, NextFunction } from 'express';
import {
  authService,
  studentProfileService,
  academicService,
  skillService,
  preferenceService,
  careerService,
  evidenceService,
  skillGapService,
  recommendationService,
  comparisonService,
  reportService,
  adminService,
  notificationService,
  ServiceError,
} from './services.ts';
import { copilotService } from './copilotService.ts';
import { db } from './db.ts';
import { SafeUser } from '../types/index.ts';
import { getServiceContainer } from '../patterns/di/ServiceContainer.ts';
import { DatabaseConnectionManager } from '../patterns/singleton/DatabaseConnectionManager.ts';
import { EvidenceFactory, EvidenceType } from '../patterns/factory/EvidenceFactory.ts';
import { CareerReadinessContext } from '../patterns/strategy/CareerReadinessStrategy.ts';

// In-memory session store (token -> { user: SafeUser, expiresAt: number })
// Supports Bearer Token / x-session-id as well as Cookie header for iframe safety!
export const sessionStore = new Map<string, { user: SafeUser; expiresAt: number }>();

function generateToken(): string {
  return 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Request extension
export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
  requestId?: string;
}

// Helper to extract token from Header or Cookie
function extractToken(req: Request): string | null {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const customHeader = req.headers['x-session-id'];
  if (typeof customHeader === 'string' && customHeader) {
    return customHeader;
  }
  // Check cookie
  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const match = cookieHeader.match(/pathproof_session=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

// Middleware: Authenticate Session
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Authentication session required.' },
      meta: { requestId: req.requestId },
    });
  }

  const session = sessionStore.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessionStore.delete(token);
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Session expired or invalid.' },
      meta: { requestId: req.requestId },
    });
  }

  // Verify user still active
  const freshUser = db.tables.users.find((u) => u.user_id === session.user.user_id);
  if (!freshUser || freshUser.account_status === 'DISABLED') {
    sessionStore.delete(token);
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Account is deactivated.' },
      meta: { requestId: req.requestId },
    });
  }

  req.user = authService.toSafeUser(freshUser);
  next();
}

// Middleware: Require Admin Role
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Administrator privileges required for this resource.' },
      meta: { requestId: req.requestId },
    });
  }
  next();
}

// Middleware: Require Student Role
export function requireStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'STUDENT') {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Only student accounts can perform this student operation.' },
      meta: { requestId: req.requestId },
    });
  }
  next();
}

export function createApiRouter(): Router {
  const api = Router();

  // Assign request ID
  api.use((req: AuthenticatedRequest, res, next) => {
    req.requestId = 'req_' + Math.random().toString(36).substring(2, 9);
    next();
  });

  // Health check
  api.get('/health', (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      data: {
        status: 'UP',
        service: 'PathProof Phase 1 API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
      meta: { requestId: req.requestId },
    });
  });

  // ----------------------------------------------------
  // Authentication Routes
  // ----------------------------------------------------
  api.post('/auth/register', (req: AuthenticatedRequest, res) => {
    try {
      const { fullName, email, password, role } = req.body;
      const newUser = authService.registerStudent(fullName, email, password, role);

      // Create session token
      const token = generateToken();
      sessionStore.set(token, {
        user: newUser,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      res.setHeader('Set-Cookie', `pathproof_session=${token}; Path=/; HttpOnly; SameSite=Lax`);
      res.status(201).json({
        success: true,
        data: {
          user: newUser,
          token,
        },
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.post('/auth/login', (req: AuthenticatedRequest, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ServiceError('Email and password are required.', 'VALIDATION_ERROR', 400);
      }

      const user = authService.authenticate(email, password);

      const token = generateToken();
      sessionStore.set(token, {
        user,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      res.setHeader('Set-Cookie', `pathproof_session=${token}; Path=/; HttpOnly; SameSite=Lax`);
      res.json({
        success: true,
        data: {
          user,
          token,
        },
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
    const token = extractToken(req);
    if (token) sessionStore.delete(token);

    res.setHeader('Set-Cookie', `pathproof_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
    res.json({
      success: true,
      data: { message: 'Logged out successfully.' },
      meta: { requestId: req.requestId },
    });
  });

  api.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      data: { user: req.user },
      meta: { requestId: req.requestId },
    });
  });

  api.get('/auth/csrf', (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      data: { csrfToken: 'csrf_' + Math.random().toString(36).substring(2) },
      meta: { requestId: req.requestId },
    });
  });

  // ----------------------------------------------------
  // Student Profile & Academic Subjects
  // ----------------------------------------------------
  api.get('/students/me/profile', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    const profile = studentProfileService.getProfile(req.user!.user_id);
    res.json({
      success: true,
      data: profile,
      meta: { requestId: req.requestId },
    });
  });

  api.put('/students/me/profile', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const updated = studentProfileService.updateProfile(req.user!.user_id, req.body);
      res.json({
        success: true,
        data: updated,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.get('/academic-subjects', requireAuth, (req: AuthenticatedRequest, res) => {
    const subjects = academicService.listActiveSubjects();
    res.json({
      success: true,
      data: subjects,
      meta: { requestId: req.requestId },
    });
  });

  api.get('/students/me/subjects', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    const list = academicService.getStudentSubjects(req.user!.user_id);
    res.json({
      success: true,
      data: list,
      meta: { requestId: req.requestId },
    });
  });

  api.post('/students/me/subjects', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const { subjectId, studyStatus, gradeText, semesterTaken } = req.body;
      if (!subjectId || !studyStatus) {
        throw new ServiceError('Subject ID and study status are required.', 'VALIDATION_ERROR', 400);
      }
      const item = academicService.addStudentSubject(
        req.user!.user_id,
        Number(subjectId),
        studyStatus,
        gradeText,
        semesterTaken ? Number(semesterTaken) : null
      );
      res.status(201).json({
        success: true,
        data: item,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.put('/students/me/subjects/:id', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      const { studyStatus, gradeText, semesterTaken } = req.body;
      const item = academicService.updateStudentSubject(
        req.user!.user_id,
        id,
        studyStatus,
        gradeText,
        semesterTaken ? Number(semesterTaken) : null
      );
      res.json({
        success: true,
        data: item,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.delete('/students/me/subjects/:id', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      academicService.removeStudentSubject(req.user!.user_id, id);
      res.json({
        success: true,
        data: { message: 'Subject record removed.' },
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  // ----------------------------------------------------
  // Skills & Preferences
  // ----------------------------------------------------
  api.get('/skills', requireAuth, (req: AuthenticatedRequest, res) => {
    const list = skillService.listActiveSkills();
    res.json({
      success: true,
      data: list,
      meta: { requestId: req.requestId },
    });
  });

  api.get('/students/me/skills', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    const list = skillService.getStudentSkills(req.user!.user_id);
    res.json({
      success: true,
      data: list,
      meta: { requestId: req.requestId },
    });
  });

  api.post('/students/me/skills', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const { skillId, proficiencyLevel, notes } = req.body;
      if (!skillId || proficiencyLevel === undefined) {
        throw new ServiceError('Skill ID and proficiency level are required.', 'VALIDATION_ERROR', 400);
      }
      const item = skillService.addStudentSkill(
        req.user!.user_id,
        Number(skillId),
        Number(proficiencyLevel),
        notes
      );
      res.status(201).json({
        success: true,
        data: item,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.put('/students/me/skills/:id', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      const { proficiencyLevel, notes } = req.body;
      const item = skillService.updateStudentSkill(req.user!.user_id, id, Number(proficiencyLevel), notes);
      res.json({
        success: true,
        data: item,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.delete('/students/me/skills/:id', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      skillService.removeStudentSkill(req.user!.user_id, id);
      res.json({
        success: true,
        data: { message: 'Skill record removed.' },
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.get('/interest-tags', requireAuth, (req: AuthenticatedRequest, res) => {
    const tags = preferenceService.listActiveTags();
    res.json({
      success: true,
      data: tags,
      meta: { requestId: req.requestId },
    });
  });

  api.get('/students/me/preferences', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    const list = preferenceService.getStudentPreferences(req.user!.user_id);
    res.json({
      success: true,
      data: list,
      meta: { requestId: req.requestId },
    });
  });

  api.put('/students/me/preferences', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const { preferences } = req.body;
      if (!preferences || !Array.isArray(preferences)) {
        throw new ServiceError('Preferences array required.', 'VALIDATION_ERROR', 400);
      }
      const updated = preferenceService.replaceStudentPreferences(req.user!.user_id, preferences);
      res.json({
        success: true,
        data: updated,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  // ----------------------------------------------------
  // Career Catalogue & Job Evidence
  // ----------------------------------------------------
  api.get('/careers', requireAuth, (req: AuthenticatedRequest, res) => {
    const query = req.query.query as string | undefined;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const includeDrafts = req.user?.role === 'ADMIN';

    const list = careerService.listCareers(query, categoryId, includeDrafts);
    res.json({
      success: true,
      data: list,
      meta: { requestId: req.requestId },
    });
  });

  api.get('/careers/:careerId', requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.careerId);
      const includeDrafts = req.user?.role === 'ADMIN';
      const detail = careerService.getCareerDetail(id, includeDrafts);
      res.json({
        success: true,
        data: detail,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.get('/careers/:careerId/evidence', requireAuth, (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.careerId);
    const list = evidenceService.getCareerEvidence(id);
    res.json({
      success: true,
      data: list,
      meta: { requestId: req.requestId },
    });
  });

  api.get('/careers/:careerId/market-summary', requireAuth, (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.careerId);
    const summary = evidenceService.getCareerMarketSummary(id);
    res.json({
      success: true,
      data: summary,
      meta: { requestId: req.requestId },
    });
  });

  api.get('/careers/:careerId/skill-requirements', requireAuth, (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.careerId);
    const skills = db.tables.career_skills.filter((cs) => cs.career_id === id);
    const taxonomy = new Map(db.tables.skills.map((s) => [s.skill_id, s]));

    const result = skills.map((s) => ({
      ...s,
      skill_name: taxonomy.get(s.skill_id)?.skill_name || `Skill #${s.skill_id}`,
      skill_category: taxonomy.get(s.skill_id)?.skill_category || 'General',
    }));

    res.json({
      success: true,
      data: result,
      meta: { requestId: req.requestId },
    });
  });

  api.get('/careers/:careerId/subject-mappings', requireAuth, (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.careerId);
    const subs = db.tables.career_subjects.filter((cs) => cs.career_id === id);
    const taxonomy = new Map(db.tables.academic_subjects.map((s) => [s.subject_id, s]));

    const result = subs.map((s) => ({
      ...s,
      subject_name: taxonomy.get(s.subject_id)?.subject_name || `Subject #${s.subject_id}`,
      subject_category: taxonomy.get(s.subject_id)?.subject_category || 'General',
    }));

    res.json({
      success: true,
      data: result,
      meta: { requestId: req.requestId },
    });
  });

  // ----------------------------------------------------
  // Recommendations, Comparison, Skill Gap & Report
  // ----------------------------------------------------
  api.post('/career-recommendations', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const result = recommendationService.generateForStudent(req.user!.user_id);
      res.status(201).json({
        success: true,
        data: result,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.get('/career-recommendations/latest', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    const latest = recommendationService.getLatestForStudent(req.user!.user_id);
    res.json({
      success: true,
      data: latest,
      meta: { requestId: req.requestId },
    });
  });

  api.post('/career-comparisons', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const { careerIds } = req.body;
      if (!careerIds || !Array.isArray(careerIds)) {
        throw new ServiceError('careerIds array is required.', 'VALIDATION_ERROR', 400);
      }
      const comparison = comparisonService.compareCareers(req.user!.user_id, careerIds.map(Number));
      res.json({
        success: true,
        data: comparison,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.get('/careers/:careerId/skill-gap', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const careerId = Number(req.params.careerId);
      const gap = skillGapService.analyze(req.user!.user_id, careerId);
      res.json({
        success: true,
        data: gap,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.get('/careers/:careerId/reality-report', requireAuth, requireStudent, (req: AuthenticatedRequest, res) => {
    try {
      const careerId = Number(req.params.careerId);
      const report = reportService.getCareerRealityReport(req.user!.user_id, careerId);
      res.json({
        success: true,
        data: report,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  // ----------------------------------------------------
  // Admin Endpoints
  // ----------------------------------------------------
  api.get('/admin/users', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    const users = adminService.listUsers();
    res.json({
      success: true,
      data: users,
      meta: { requestId: req.requestId },
    });
  });

  api.patch('/admin/users/:id/status', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const targetId = Number(req.params.id);
      const { status } = req.body;
      if (!['ACTIVE', 'DISABLED'].includes(status)) {
        throw new ServiceError('Status must be ACTIVE or DISABLED.', 'VALIDATION_ERROR', 400);
      }
      const updated = adminService.setUserStatus(req.user!.user_id, targetId, status);
      res.json({
        success: true,
        data: updated,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.post('/admin/careers', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const created = adminService.createCareer(req.user!.user_id, req.body);
      res.status(201).json({
        success: true,
        data: created,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.put('/admin/careers/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      const updated = adminService.updateCareer(req.user!.user_id, id, req.body);
      res.json({
        success: true,
        data: updated,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.put('/admin/careers/:id/mappings', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      const result = adminService.updateCareerMappings(req.user!.user_id, id, req.body);
      res.json({
        success: true,
        data: result,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.post('/admin/job-evidence', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const created = adminService.createJobEvidence(req.user!.user_id, req.body);
      res.status(201).json({
        success: true,
        data: created,
        meta: { requestId: req.requestId },
      });
    } catch (err: any) {
      handleError(err, req, res);
    }
  });

  api.get('/admin/data-quality', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    const report = adminService.getDataQualityReport();
    res.json({
      success: true,
      data: report,
      meta: { requestId: req.requestId },
    });
  });

  // Admin DB Reset Helper (Convenience for testing & demo reset)
  api.post('/admin/reset-database', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
    db.resetToSeed();
    adminService.logAudit(req.user!.user_id, 'RESET_DATABASE', 'SYSTEM', 'ALL', 'Database reset to canonical seed data.');
    res.json({
      success: true,
      data: { message: 'Database reset to initial seed state.' },
      meta: { requestId: req.requestId },
    });
  });

  // ----------------------------------------------------
  // Notifications Routes
  // ----------------------------------------------------
  api.get('/notifications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const notes = notificationService.getNotificationsForUser(req.user!.user_id);
      res.json({
        success: true,
        data: notes,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.patch('/notifications/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const noteId = parseInt(req.params.id, 10);
      notificationService.markAsRead(req.user!.user_id, noteId);
      res.json({
        success: true,
        data: { message: 'Notification marked as read.' },
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.post('/notifications/read-all', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      notificationService.markAllAsRead(req.user!.user_id);
      res.json({
        success: true,
        data: { message: 'All notifications marked as read.' },
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // ----------------------------------------------------
  // PathProof Copilot Endpoints
  // ----------------------------------------------------
  api.post('/copilot/chat', requireAuth, requireStudent, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { conversationId, message } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        throw new ServiceError('Message text is required.', 'VALIDATION_ERROR', 400);
      }
      const convId = conversationId ? Number(conversationId) : 0;
      const result = await copilotService.handleUserMessage(req.user!.user_id, convId, message.trim());
      res.json({
        success: true,
        data: result,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/copilot/conversations', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const list = copilotService.getConversations(req.user!.user_id);
      res.json({
        success: true,
        data: list,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.post('/copilot/conversations', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title } = req.body;
      const conv = copilotService.createConversation(req.user!.user_id, title);
      res.status(201).json({
        success: true,
        data: conv,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/copilot/conversations/:id', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = copilotService.getConversation(id, req.user!.user_id);
      if (!data) {
        throw new ServiceError('Conversation not found or access denied.', 'NOT_FOUND', 404);
      }
      res.json({
        success: true,
        data,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.delete('/copilot/conversations/:id', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const ok = copilotService.deleteConversation(id, req.user!.user_id);
      if (!ok) {
        throw new ServiceError('Conversation not found or access denied.', 'NOT_FOUND', 404);
      }
      res.json({
        success: true,
        data: { message: 'Conversation deleted successfully.' },
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/copilot/context', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const context = copilotService.buildStudentContext(req.user!.user_id);
      res.json({
        success: true,
        data: context,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.post('/copilot/actions/confirm', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { actionId, editedPayload } = req.body;
      if (!actionId) {
        throw new ServiceError('actionId is required.', 'VALIDATION_ERROR', 400);
      }
      const roadmap = copilotService.confirmAction(req.user!.user_id, Number(actionId), editedPayload);
      if (!roadmap) {
        throw new ServiceError('Failed to confirm action. Invalid payload or unauthorized.', 'BAD_REQUEST', 400);
      }
      res.json({
        success: true,
        data: roadmap,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/copilot/roadmaps', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const roadmaps = copilotService.getStudentRoadmaps(req.user!.user_id);
      res.json({
        success: true,
        data: roadmaps,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.patch('/copilot/roadmaps/milestones/:id', requireAuth, requireStudent, (req: AuthenticatedRequest, res: Response) => {
    try {
      const milestoneId = Number(req.params.id);
      const updated = copilotService.toggleMilestone(req.user!.user_id, milestoneId);
      if (!updated) {
        throw new ServiceError('Milestone not found or unauthorized.', 'NOT_FOUND', 404);
      }
      res.json({
        success: true,
        data: updated,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // ----------------------------------------------------
  // Software Construction & Development (SCD) Patterns API
  // ----------------------------------------------------
  api.get('/patterns/overview', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dbMgr = DatabaseConnectionManager.getInstance();
      const ping = await dbMgr.ping();
      const container = getServiceContainer();

      res.json({
        success: true,
        data: {
          architecture: 'Software Construction & Development (SCD) University Architecture',
          patterns: {
            singleton: {
              pattern: 'Singleton Pattern',
              class: 'DatabaseConnectionManager',
              purpose: 'Centralized MySQL connection pool management with failure resiliency',
              status: ping.message,
              host: ping.host,
              database: ping.database,
            },
            factory: {
              pattern: 'Factory Pattern',
              class: 'EvidenceFactory',
              purpose: 'Instantiates specialized processors for 5 evidence categories',
              processors: [
                'ProjectEvidenceProcessor',
                'GitHubEvidenceProcessor',
                'CourseworkEvidenceProcessor',
                'CertificationEvidenceProcessor',
                'ResearchEvidenceProcessor',
              ],
            },
            observer: {
              pattern: 'Observer Pattern',
              subject: 'VerificationEventSubject',
              purpose: 'Decoupled event broadcasting on evidence verification status transitions',
              registeredObservers: [
                'ReadinessObserver',
                'NotificationObserver',
                'ActivityHistoryObserver',
                'RoadmapObserver',
              ],
            },
            strategy: {
              pattern: 'Strategy Pattern',
              interface: 'ICareerReadinessStrategy',
              purpose: 'Discipline-specific career readiness scoring and skill gap evaluation',
              strategies: [
                'FullStackReadinessStrategy',
                'AIEngineerReadinessStrategy',
                'CloudEngineerReadinessStrategy',
                'DataEngineerReadinessStrategy',
                'MobileDeveloperReadinessStrategy',
              ],
            },
            repository: {
              pattern: 'Repository Pattern',
              purpose: 'Data access abstraction for 15 MySQL relational schema tables',
              repositories: [
                'UserRepository',
                'StudentRepository',
                'CareerRepository',
                'CompetencyRepository',
                'EvidenceRepository',
                'VerificationRepository',
                'RoadmapRepository',
                'NotificationRepository',
              ],
            },
            dependencyInjection: {
              pattern: 'Dependency Injection',
              container: 'ServiceContainer',
              purpose: 'Wires repositories and strategies into domain services without tight coupling',
            },
          },
        },
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/patterns/singleton/status', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dbMgr = DatabaseConnectionManager.getInstance();
      const ping = await dbMgr.ping();
      const config = dbMgr.getConfig();
      res.json({
        success: true,
        data: {
          status: ping.ok ? 'HEALTHY' : 'DEGRADED',
          message: ping.message,
          host: config.host,
          port: config.port,
          database: config.database,
          connectionLimit: config.connectionLimit,
          sslEnabled: config.sslEnabled,
          sslCaConfigured: config.sslCaConfigured,
          isMockFallbackActive: dbMgr.isUsingMockDriver(),
        },
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/patterns/singleton/diagnostics', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { runDatabaseDiagnostics } = await import('../../lib/db-test.ts');
      const report = await runDatabaseDiagnostics({ logToConsole: true });
      res.status(report.select1Check.passed ? 200 : 503).json({
        success: report.select1Check.passed,
        data: report,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.post('/patterns/singleton/initialize', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { initializeAndVerifyPathProofDb } = await import('../../lib/db-setup.ts');
      const result = await initializeAndVerifyPathProofDb();
      res.status(200).json({
        success: result.tablesVerification.allPresent && result.poolVerification.select1Passed,
        data: result,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.post('/patterns/factory/process', (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, description, evidence_type, external_url } = req.body;
      if (!title || !description || !evidence_type) {
        throw new ServiceError('title, description, and evidence_type are required.', 'VALIDATION_ERROR', 400);
      }
      const processed = EvidenceFactory.process({
        title,
        description,
        evidence_type: evidence_type as EvidenceType,
        external_url,
      });
      res.json({
        success: true,
        data: processed,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.post('/patterns/observer/review', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const container = getServiceContainer();
      const { evidenceId, reviewerUserId, reviewerName, newStatus, feedback } = req.body;
      if (!evidenceId || !newStatus || !feedback) {
        throw new ServiceError('evidenceId, newStatus, and feedback are required.', 'VALIDATION_ERROR', 400);
      }

      const result = await container.verificationService.reviewEvidence({
        evidenceId: Number(evidenceId),
        reviewerUserId: Number(reviewerUserId || 3),
        reviewerName: reviewerName || 'Dr. Shahbaz Akhtar',
        newStatus,
        feedback,
      });

      res.json({
        success: true,
        data: result,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/patterns/strategy/evaluate/:slug', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const container = getServiceContainer();
      const careerSlug = req.params.slug;
      const userId = req.query.userId ? Number(req.query.userId) : 1;

      const evaluation = await container.readinessService.evaluateReadinessForCareer(userId, careerSlug);
      res.json({
        success: true,
        data: evaluation,
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  api.get('/patterns/repositories/summary', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const container = getServiceContainer();
      const [users, careers, evidence] = await Promise.all([
        container.userRepository.listAll(),
        container.careerRepository.findAllPublished(),
        container.evidenceRepository.findByUserId(1),
      ]);

      res.json({
        success: true,
        data: {
          totalUsers: users.length,
          publishedCareers: careers.length,
          hamzaEvidenceItems: evidence.length,
          sampleUsers: users.map((u) => ({ id: u.user_id, email: u.email, name: u.full_name, role: u.role })),
        },
        meta: { requestId: req.requestId },
      });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  return api;
}

function handleError(err: any, req: AuthenticatedRequest, res: Response) {
  if (err instanceof ServiceError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        fields: err.fields,
      },
      meta: { requestId: req.requestId },
    });
  }

  console.error('[API Error]', err);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected server error occurred.',
    },
    meta: { requestId: req.requestId },
  });
}
